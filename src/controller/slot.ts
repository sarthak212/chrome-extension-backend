import { Request, Response } from "express";
import { RequestInterface } from "../interface";
import { uploadToS3 } from "../helpers/aws";
import { Screenshot } from "../schema/screenshot";
import { User } from "../schema/user";
import { Logs } from "../schema/logs";

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
    const { location, dates }: { location: string; dates: any } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!dates || !location) {
      return res
        .status(400)
        .json({ message: "Date and location details are required" });
    }
    if (!Array.isArray(dates)) {
      return res.status(400).json({ message: "Dates should be an array" });
    }
    const updatedDate = dates.map((date: any) => new Date(date));
    let lowestData = updatedDate.sort((a, b) => a.getTime() - b.getTime())[0];
    await Logs.updateOne(
      {
        location: location,
      },
      {
        $addToSet: { dates: { $each: updatedDate } },
        $min: { start_date: lowestData },
      },
      { upsert: true }
    );
    // notify User
    return res.status(200).json({ message: "Logs updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
