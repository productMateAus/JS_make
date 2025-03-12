import fs from "fs";
import path from "path";

export default function handler(req, res) {
    console.log("📥 Received request to download DOCX");

    // Get the file path from query parameters
    const filePath = req.query.path ? decodeURIComponent(req.query.path) : path.join("/tmp", "output.docx");

    // Debug: Log available files in /tmp/
    console.log("📂 Available files in /tmp/:", fs.readdirSync("/tmp/"));

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error("❌ ERROR: File does not exist!", filePath);
        return res.status(404).json({ error: "File not found" });
    }

    // Set headers for download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=output.docx");

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}