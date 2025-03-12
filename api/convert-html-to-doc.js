import { put } from "@vercel/blob";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "Missing HTML content" });
        }

        // Convert HTML to DOCX
        const htmlToDocx = (await import("html-to-docx")).default;
        const buffer = await htmlToDocx(html);

        // Upload file to Vercel Blob Storage
        const fileName = `generated-${Date.now()}.docx`;
        const { url } = await put(fileName, buffer, {
            access: "public",
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        return res.status(200).json({ message: "Success", downloadUrl: url });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}