const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const htmlToDocx = require("html-to-docx");

const app = express();
app.use(bodyParser.json()); // Enable JSON parsing

// ✅ Route to convert HTML to Word
app.post("/convert-html-to-doc", async (req, res) => {
    try {
        const inputHtml = req.body.html;
        if (!inputHtml) {
            return res.status(400).json({ error: "No HTML input received." });
        }

        // ✅ Convert HTML to DOCX
        const docxBuffer = await htmlToDocx(inputHtml);

        // ✅ Save DOCX file locally
        const fileName = `converted-${Date.now()}.docx`;
        const filePath = `./output/${fileName}`;

        // Ensure the output folder exists
        if (!fs.existsSync("./output")) {
            fs.mkdirSync("./output");
        }

        fs.writeFileSync(filePath, docxBuffer);

        // ✅ Send back the file URL (Modify based on hosting)
        res.json({ 
            message: "Conversion successful",
            fileUrl: `https://your-server.com/output/${fileName}`
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));