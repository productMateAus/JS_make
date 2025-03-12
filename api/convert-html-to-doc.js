import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // Fetch API for retrieving the template
import htmlToDocx from "html-to-docx";
import { put } from "@vercel/blob"; // If you need to save the generated doc

export default async function handler(req, res) {
    try {
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "HTML content is required" });
        }

        // Step 1: Fetch the Word template from Vercel Blob Storage
        const templateUrl = "https://iszp5efqsz9wsw1l.public.blob.vercel-storage.com/template-e2mD0RSZY23zjfZhBhE6qzsf8uThVG.dotx"; // Replace with your actual template URL
        console.log(`Fetching template from: ${templateUrl}`);

        const templateResponse = await fetch(templateUrl);
        if (!templateResponse.ok) {
            throw new Error(`Failed to fetch template: ${templateResponse.statusText}`);
        }
        const templateBuffer = await templateResponse.arrayBuffer();

        // Step 2: Convert HTML to DOCX using the template
        const docxBuffer = await htmlToDocx(html, {
            template: Buffer.from(templateBuffer),
        });

        // Step 3: Save the DOCX file to Vercel Blob Storage (Optional)
        const timestamp = Date.now();
        const fileName = `generated-docx-${timestamp}.docx`;
        const { url: downloadUrl } = await put(fileName, docxBuffer, {
            access: "public",
        });

        console.log("✅ DOCX File Created:", downloadUrl);

        // Step 4: Return the download link
        return res.status(200).json({
            message: "Success",
            downloadUrl,
        });

    } catch (error) {
        console.error("❌ Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
