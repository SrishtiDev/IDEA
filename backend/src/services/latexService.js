const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function compileLatexToPdf(latexCode) {
    return new Promise(async (resolve, reject) => {
        const id = crypto.randomBytes(8).toString('hex');
        
        // We use process.cwd() so it works regardless of where the app is started
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        const texPath = path.join(tmpDir, `${id}.tex`);
        const pdfPath = path.join(tmpDir, `${id}.pdf`);

        fs.writeFileSync(texPath, latexCode);

        try {
            const axios = require('axios');
            const data = {
                compiler: "pdflatex",
                resources: [
                    { main: true, content: latexCode }
                ]
            };
            const response = await axios.post('https://latex.ytotech.com/builds/sync', data, {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pdfPath, response.data);
            
            if (fs.existsSync(pdfPath)) {
                resolve({ texPath, pdfPath });
            } else {
                reject(new Error("PDF not generated"));
            }
        } catch (error) {
            console.error("LaTeX API error:", error.message);
            reject(new Error("Error compiling PDF: " + error.message));
        }
    });
}

function cleanupFiles(paths) {
    paths.forEach(p => {
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
        }
    });
}

module.exports = {
    compileLatexToPdf,
    cleanupFiles
};
