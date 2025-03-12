import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        console.log("📥 Received Request to Convert HTML to DOCX");

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { html } = req.body;
        if (!html) {
            console.error("❌ ERROR: Missing HTML content in request");
            return res.status(400).json({ error: "Missing HTML content" });
        }

        // Dynamically import the library
        let htmlToDocx;
        try {
            const module = await import("html-to-docx");
            htmlToDocx = module.default || module.htmlToDocx;
        } catch (err) {
            console.error("❌ ERROR: Failed to import html-to-docx module", err);
            return res.status(500).json({ error: "Failed to load document converter" });
        }

        // Generate DOCX content
        const docxBuffer = await htmlToDocx(html);

        if (!docxBuffer) {
            console.error("❌ ERROR: DOCX buffer is empty");
            return res.status(500).json({ error: "Failed to generate DOCX" });
        }

        // Define file path in /tmp/
        const fileName = `generated-docx-${Date.now()}.docx`;
        const filePath = `/tmp/${fileName}`;

        // Save file
        fs.writeFileSync(filePath, docxBuffer);
        console.log("✅ DOCX File Created:", filePath);
        console.log("📂 Files in /tmp/:", fs.readdirSync("/tmp/")); // Log available files

        // Return download URL
        return res.status(200).json({
            message: "Success",
            downloadUrl: `https://${req.headers.host}/api/download-docx?path=${encodeURIComponent(filePath)}`
        });

    } catch (error) {
        console.error("❌ ERROR: Internal Server Error", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}