const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/explore', apiController.exploreProject);
router.post('/generate', apiController.generateProject);
router.get('/trending', apiController.getTrending);

module.exports = router;
