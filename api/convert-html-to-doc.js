import fs from "fs";
import path from "path";
import fetch from "node-fetch"; 
import htmlToDocx from "html-to-docx";
import { put } from "@vercel/blob"; 

export default async function handler(req, res) {
    try {
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "HTML content is required" });
        }

        // Clean the HTML before processing
        function cleanHTML(inputHTML) {
            if (typeof inputHTML !== "string" || !inputHTML) return "";
            return inputHTML
                .replace(/&/g, "&amp;")
                .replace(/'/g, "&apos;")
                .replace(/"/g, "&quot;")
                .replace(/<br\s*\/?>/g, "")
                .replace(/\s?id=""/g, "")
                .replace(/\n/g, " ")
                .trim();
        }

        const cleanedHTML = cleanHTML(html);

        // Step 1: Fetch the Word template from Vercel Blob Storage
        const templateUrl = "https://iszp5efqsz9wsw1l.public.blob.vercel-storage.com/template-e2mD0RSZY23zjfZhBhE6qzsf8uThVG.dotx";
        console.log(`Fetching template from: ${templateUrl}`);

        const templateResponse = await fetch(templateUrl);
        if (!templateResponse.ok) {
            throw new Error(`Failed to fetch template: ${templateResponse.statusText}`);
        }
        const templateBuffer = await templateResponse.arrayBuffer();

        // Step 2: Convert Cleaned HTML to DOCX using the template
        const docxBuffer = await htmlToDocx(cleanedHTML, {
            template: Buffer.from(templateBuffer),
            font: "Arial",
            fontSize: 11,
            paragraph: {
                spacing: { line: 280 },
            },
        });

        // Step 3: Save the DOCX file to Vercel Blob Storage (Optional)
        const timestamp = Date.now();
        const fileName = `generated-docx-${timestamp}.docx`;
        const { url: downloadUrl } = await put(fileName, docxBuffer, {
            access: "public",
        });

        console.log("✅ DOCX File Created:", downloadUrl);

        return res.status(200).json({
            message: "Success",
            downloadUrl,
        });

    } catch (error) {
        console.error("❌ Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
