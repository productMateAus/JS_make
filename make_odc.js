const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const htmlToDocx = require("html-to-docx");

const app = express();
app.use(bodyParser.json());

// ✅ Ensure this route is correctly defined
app.post("/convert-html-to-doc", async (req, res) => {
    try {
        const inputHtml = req.body.html;
        if (!inputHtml) {
            return res.status(400).json({ error: "No HTML input received." });
        }

        const docxBuffer = await htmlToDocx(inputHtml);
        const fileName = `converted-${Date.now()}.docx`;
        const filePath = `./output/${fileName}`;

        fs.writeFileSync(filePath, docxBuffer);

        res.json({
            message: "Conversion successful",
            fileUrl: `https://js-make-dy1ske2dd-craigs-projects-881f569a.vercel.app/output/${fileName}`
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
