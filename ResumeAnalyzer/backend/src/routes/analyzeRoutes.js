const express = require('express');
const multer = require('multer');
const analyzeController = require('../controllers/analyzeController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint 1: Upload resume, get analysis feedback
router.post('/', upload.single('resume'), analyzeController.analyzeResume);

// Endpoint 2: Generate LaTeX code based on feedback
router.post('/latex', analyzeController.generateLatex);

module.exports = router;
