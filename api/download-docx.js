import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const filePath = path.join("/tmp", "output.docx");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=output.docx");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}