const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const htmlToDocx = require("html-to-docx");

const app = express();
app.use(bodyParser.json());

console.log("✅ Server file loaded."); // Debug log

app.post("/api/convert-html-to-doc", async (req, res) => {
    console.log("🔄 API received request..."); // Debug log

    try {
        const html = req.body.html;
        if (!html) {
            console.log("⚠️ No HTML content provided.");
            return res.status(400).json({ error: "No HTML content provided." });
        }

        console.log("📄 Converting HTML to DOCX...");
        const docxBuffer = await htmlToDocx(html);

        console.log("✅ Conversion successful, sending file...");
        res.setHeader("Content-Disposition", "attachment; filename=document.docx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(docxBuffer);
    } catch (error) {
        console.error("❌ Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));