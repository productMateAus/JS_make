import { htmlToDocx } from "html-to-docx";
import { writeFileSync } from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    try {
        console.log("✅ API Request Received");

        // Get HTML content from request body
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "Missing HTML content in request body" });
        }

        console.log("🔄 Converting HTML to DOCX...");
        const docxBuffer = await htmlToDocx(html);

        // Save the file for debugging (optional)
        const filePath = path.join("/tmp", "output.docx");
        writeFileSync(filePath, docxBuffer);
        console.log("✅ DOCX File Created at", filePath);

        // Set headers to force file download
        res.setHeader("Content-Disposition", 'attachment; filename="document.docx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send the DOCX file as a response
        res.status(200).send(docxBuffer);
    } catch (error) {
        console.error("❌ Error Processing Request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
