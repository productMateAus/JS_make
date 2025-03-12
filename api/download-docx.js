import fs from "fs";
import path from "path";

export default function handler(req, res) {
    console.log("📥 Received request to download DOCX");

    const filePath = req.query.path ? decodeURIComponent(req.query.path) : path.join("/tmp", "output.docx");

    // Debugging
    console.log("📂 Available files in /tmp/:", fs.readdirSync("/tmp/"));

    if (!fs.existsSync(filePath)) {
        console.error("❌ ERROR: File not found!", filePath);
        return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
