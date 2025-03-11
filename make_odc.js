async function generateWordDoc(input) {
    const htmlContent = input.htmlInput || "No content provided.";

    const wordML = `
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
            <w:p><w:r><w:t>${htmlContent.replace(/<[^>]*>?/gm, '')}</w:t></w:r></w:p>
        </w:body>
    </w:document>`;

    function encodeToBase64(str) {
        return Buffer.from(str, 'utf8').toString('base64'); // Ensure proper encoding
    }

    const base64WordDoc = encodeToBase64(wordML);

    return {
        "fileName": "Generated-Document.docx",
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "data": base64WordDoc
    };
}

// Export function so Make.com can call it
module.exports = generateWordDoc;
