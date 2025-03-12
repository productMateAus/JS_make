import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        // Ensure this is a POST request
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        // Extract HTML content
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "Missing HTML content" });
        }

        // Import the library dynamically
        const { htmlToDocx } = await import("html-to-docx");

        // Generate DOCX content
        const docxBuffer = await htmlToDocx(html);

        // Define file path in /tmp/
        const filePath = `/tmp/generated-docx-${Date.now()}.docx`;

        // Save file to /tmp/
        fs.writeFileSync(filePath, docxBuffer);

        // Debugging: Check if file was created
        console.log("✅ DOCX File Created:", filePath);
        console.log("📂 Files in /tmp/:", fs.readdirSync("/tmp/")); // Log files in /tmp/

        // Return the download URL
        return res.status(200).json({
            message: "Success",
            downloadUrl: `https://${req.headers.host}/api/download-docx?path=${encodeURIComponent(filePath)}`
        });

    } catch (error) {
        console.error("❌ Error Processing Request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}