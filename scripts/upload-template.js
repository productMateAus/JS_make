import dotenv from "dotenv";
dotenv.config();
import { put } from "@vercel/blob";
import fs from "fs";
import "dotenv/config";  // Load environment variables

async function uploadTemplate() {
    const fileBuffer = fs.readFileSync("template.dotx");

    // ✅ Pass token explicitly
    const { url } = await put("template.dotx", fileBuffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,  // ✅ Using the environment variable
    });

    console.log("✅ Template uploaded to:", url);
}
uploadTemplate();