import { Request, Response } from "express";
import { RequestInterface } from "../interface";
import { uploadToS3 } from "../helpers/aws";
import { Screenshot } from "../schema/screenshot";
import { User } from "../schema/user";
import { Logs } from "../schema/logs";
import { notifyAllUsers } from "../helpers/mailer";
import { validateSlotUpdate } from "../validation/slot";
import queue from "../helpers/queue";

const monthsName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function uploadScreenShot(req: RequestInterface, res: Response) {
  try {
    const { file } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    let fileName = `${user.id}-${Date.now()}.png`;
    const response = await uploadToS3({ data: file, fileName });
    if (!response.status) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    let url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    await Screenshot.create({
      url: url,
      user_id: user.id,
    });
    await User.updateOne(
      {
        _id: user.id,
      },
      {
        $inc: { total_count: 20, contribution_count: 1 },
      }
    );

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateSlotAvailability(
  req: RequestInterface,
  res: Response
) {
  try {
    console.log("req body ", req.body);
    const { location, dates }: any = req.body;
    const validateResponse = validateSlotUpdate(dates);
    if (!validateResponse.status) {
      return res.status(400).json({ message: validateResponse.message });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!dates || !location) {
      return res
        .status(400)
        .json({ message: "Date and location details are required" });
    }
    if (!Array.isArray(dates) || dates.length == 0) {
      return res
        .status(400)
        .json({ message: "Dates should be an array with at least one value!" });
    }
    const updateObject: any = {};
    const foundCondition: any = {};
    const availableDates: any[] = [];
    for (let i = 0; i < dates.length; i++) {
      if (updateObject[`dates.${dates[i].year}.${dates[i].month}`]) {
        updateObject[`dates.${dates[i].year}.${dates[i].month}`].push(
          dates[i].date
        );
        foundCondition[`dates.${dates[i].year}.${dates[i].month}`]["$all"].push(
          dates[i].date
        );
      } else {
        updateObject[`dates.${dates[i].year}.${dates[i].month}`] = [
          dates[i].date,
        ];
        foundCondition[`dates.${dates[i].year}.${dates[i].month}`] = {
          $all: [dates[i].date],
        };
      }

      // dates to be notified
      const newMonthYear = `${monthsName[dates[i].month]}-${dates[i].year}`;
      if (!availableDates.includes(newMonthYear)) {
        availableDates.push(newMonthYear);
      }
    }
    const docs = await Logs.findOne({
      location: location,
      ...foundCondition,
    });
    const job = queue.createJob({
      location,
      availableDates,
      updateObject,
      foundCondition,
    });
    job.save();
    if (docs) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    return res.status(200).json({ message: "Logs updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
