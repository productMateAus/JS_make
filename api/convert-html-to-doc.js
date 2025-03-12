import { htmlToDocx } from "html-to-docx";
import fs from "fs";

export default async function handler(req, res) {
    try {
        console.log("✅ API Request Received");

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "Missing HTML content" });
        }

        console.log("🔄 Converting HTML to DOCX...");
        const docxBuffer = await htmlToDocx(html);

        // Optional: Save file for debugging (remove in production)
        fs.writeFileSync("/tmp/output.docx", docxBuffer);
        console.log("✅ DOCX File Created");

        // Set response headers to force file download
        res.setHeader("Content-Disposition", "attachment; filename=document.docx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send the generated DOCX file
        res.status(200).send(docxBuffer);
    } catch (error) {
        console.error("❌ Error Processing Request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
