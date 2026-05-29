const express = require('express');
const multer = require('multer');
const analyzeController = require('../controllers/analyzeController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint 1: Upload resume, get analysis feedback
router.post('/', upload.single('resume'), analyzeController.analyzeResume);

// Endpoint 2: Generate LaTeX code based on feedback
router.post('/latex', analyzeController.generateLatex);

// Endpoint 3: Compile LaTeX to PDF
router.post('/compile', analyzeController.compileLatex);

module.exports = router;
