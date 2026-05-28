const pdfParse = require('pdf-parse');

async function extractTextFromPdf(buffer) {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
}

module.exports = {
    extractTextFromPdf
};
