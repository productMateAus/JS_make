import fs from "fs";
import path from "path";

export default function handler(req, res) {
    // Log request for debugging
    console.log("📥 Received request to download DOCX");

    // Ensure we get the correct file path from query params
    const filePath = req.query.path ? decodeURIComponent(req.query.path) : path.join("/tmp", "output.docx");

    // Debug: Log the file path
    console.log("📄 File Path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error("❌ ERROR: File does not exist!", filePath);
        return res.status(404).json({ error: "File not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename=output.docx`);

    // Create file stream and send response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}