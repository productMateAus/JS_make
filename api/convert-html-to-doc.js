import { put } from "@vercel/blob";
import { htmlToDocx } from "html-to-docx";

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

        // Convert HTML to DOCX
        const docxBuffer = await htmlToDocx(html);
        if (!docxBuffer) {
            console.error("❌ ERROR: DOCX buffer is empty");
            return res.status(500).json({ error: "Failed to generate DOCX" });
        }

        console.log("✅ DOCX File Created in Memory");

        // 📂 Upload DOCX to Vercel Blob Storage
        const blob = await put(`generated-docx-${Date.now()}.docx`, docxBuffer, {
            access: "public", // Make the file publicly accessible
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        console.log("📤 File uploaded to Vercel Blob Storage:", blob.url);

        // Return the file URL
        return res.status(200).json({
            message: "Success",
            downloadUrl: blob.url
        });

    } catch (error) {
        console.error("❌ ERROR: Internal Server Error", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
