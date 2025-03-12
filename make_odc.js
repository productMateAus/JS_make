app.post("/convert-html-to-doc", async (req, res) => {
    try {
        console.log("📩 Received request:", req.body); // Debugging log

        const { htmlContent } = req.body;
        if (!htmlContent) {
            console.log("❌ No HTML content received");
            return res.status(400).json({ error: "No HTML content provided" });
        }

        // Convert HTML to DOCX
        console.log("🔄 Converting HTML to DOCX...");
        const docxBuffer = await htmlToDocx(htmlContent);
        
        // Save File Locally (Temporary)
        const filePath = path.join(__dirname, "output.docx");
        fs.writeFileSync(filePath, docxBuffer);
        
        console.log("✅ DOCX File Generated:", filePath);

        // Send File as Download Response
        res.download(filePath, "document.docx", (err) => {
            if (err) {
                console.error("❌ Error sending file:", err);
                res.status(500).json({ error: "Error generating document" });
            } else {
                console.log("📤 File sent successfully!");
            }

            // Cleanup: Delete file after sending
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error("❌ Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});