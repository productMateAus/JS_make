const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const htmlToDocx = require("html-to-docx");

const app = express();
app.use(bodyParser.json());

app.post("/convert-html-to-doc", async (req, res) => {
    try {
        // 📝 Get HTML from request body
        const { htmlContent } = req.body;

        if (!htmlContent) {
            return res.status(400).json({ error: "No HTML content provided" });
        }

        // 🔄 Convert HTML to .docx format
        const docxBuffer = await htmlToDocx(htmlContent);

        // 📂 Define file path
        const filePath = path.join(__dirname, "output.docx");

        // 📝 Write file to the server temporarily
        fs.writeFileSync(filePath, docxBuffer);

        // 🔽 Send file as response for download
        res.download(filePath, "document.docx", (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ error: "Error generating document" });
            }

            // 🔄 Clean up: Delete file after sending
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🚀 Start the server (change port if needed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));