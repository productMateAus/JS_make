import htmlToDocx from "html-to-docx";
import { writeFileSync } from "fs";
import path from "path";

export default async function handler(req, res) {
    console.log("Received headers:", req.headers);
    console.log("Received request body:", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Ensure body is parsed correctly
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ error: "Invalid JSON received" });
        }

        // Process HTML to DOCX logic here...
        res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}