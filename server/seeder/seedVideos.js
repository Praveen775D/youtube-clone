// Seeder script to populate the database with initial video data
// server/seeder/seedVideos.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Video from "../models/Video.js";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const data = fs.readFileSync("./data/videos.json", "utf-8");
    const videos = JSON.parse(data);

    const USER_ID = "PUT_REAL_USER_ID_HERE";

    const formattedVideos = videos.map((v) => ({
      ...v,
      uploader: USER_ID,
    }));

    await Video.deleteMany();
    await Video.insertMany(formattedVideos);

    console.log(" Videos Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();