const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function compileLatexToPdf(latexCode) {
    return new Promise((resolve, reject) => {
        const id = crypto.randomBytes(8).toString('hex');
        
        // We use process.cwd() so it works regardless of where the app is started
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        
        const texPath = path.join(tmpDir, `${id}.tex`);
        const pdfPath = path.join(tmpDir, `${id}.pdf`);

        fs.writeFileSync(texPath, latexCode);

        exec(`tectonic ${texPath}`, (error) => {
            if (error) {
                console.error("Tectonic error:", error);
                return reject(new Error("Error compiling PDF"));
            }

            if (fs.existsSync(pdfPath)) {
                resolve({ texPath, pdfPath });
            } else {
                reject(new Error("PDF not generated"));
            }
        });
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
