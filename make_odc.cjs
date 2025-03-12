const express = require("express");
const bodyParser = require("body-parser");
const htmlToDocx = require("html-to-docx").default;

const app = express();
app.use(bodyParser.json());

// ✅ Ensure the endpoint is correctly defined
app.post("/api/convert-html-to-doc", async (req, res) => {
    try {
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ error: "Missing HTML content" });
        }

        console.log("Received HTML:", html); // ✅ Debugging Log

        // Convert HTML to DOCX
        const docxBuffer = await htmlToDocx(html);

        // Set response headers
        res.setHeader("Content-Disposition", "attachment; filename=document.docx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send the DOCX file
        res.send(docxBuffer);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Export for Vercel
module.exports = app;