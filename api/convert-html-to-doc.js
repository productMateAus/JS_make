import fs from "fs";
import path from "path";
import { htmlToDocx } from "html-to-docx";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { html } = req.body;

        if (!html) {
            return res.status(400).json({ error: "No HTML content provided" });
        }

        // Convert HTML to DOCX
        const docxBuffer = await htmlToDocx(html);

        // Define a file path for storing the DOCX
        const filePath = path.join("/tmp", "output.docx");

        // Save the file temporarily
        fs.writeFileSync(filePath, docxBuffer);

        // Return the file URL
        return res.status(200).json({
            message: "Success",
            downloadUrl: `https://${req.headers.host}/api/download-docx`
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
