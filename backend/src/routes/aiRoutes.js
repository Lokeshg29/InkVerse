const express = require('express');
const multer = require('multer');
const aiController = require('../controllers/aiController');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/match', upload.single('image'), aiController.matchTattoo);

module.exports = router;
