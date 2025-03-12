import fs from "fs";
import path from "path";
import htmlToDocx from "html-to-docx";

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

        const filePath = `/tmp/generated-docx-${Date.now()}.docx`;
        fs.writeFileSync(filePath, docxBuffer); // Save the DOCX file


        if (!fs.existsSync(filePath)) {
            console.error("❌ ERROR: File was not created!", filePath);
            return res.status(500).json({ error: "File was not created" });
        }

        // Log the file path for debugging
        console.log("✅ DOCX File Created:", filePath);

        // Return the file URL with the correct path
        res.status(200).json({
            message: "Success",
            downloadUrl: `https://${req.headers.host}/api/download-docx?path=${encodeURIComponent(filePath)}`
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
