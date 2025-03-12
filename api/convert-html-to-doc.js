import fs from "fs";
import path from "path";
import htmlToDocx from "html-to-docx";

export default async function handler(req, res) {
    try {
        const { html } = req.body;

        // Read the Word Template
        const templatePath = path.join(process.cwd(), "api", "template.dotx");
        const templateBuffer = fs.readFileSync(templatePath);

        // Convert HTML to DOCX using the template
        const docxBuffer = await htmlToDocx(html, {
            template: templateBuffer, // Use the template
        });

        // Save to temporary storage
        const filePath = path.join("/tmp", "output.docx");
        fs.writeFileSync(filePath, docxBuffer);

        return res.status(200).json({ message: "Success", downloadUrl: `/api/download-docx?path=${filePath}` });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}