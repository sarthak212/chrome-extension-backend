import { Request, Response } from "express";
import { RequestInterface } from "../interface";
import { uploadToS3 } from "../helpers/aws";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    let url = response.data.Location;
    await prisma.screenShot.create({
      data: {
        url: url,
        user_id: user.id,
      },
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        contribution_count: {
          increment: 1,
        },
        total_count: {
          increment: 20,
        },
      },
    });
    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
