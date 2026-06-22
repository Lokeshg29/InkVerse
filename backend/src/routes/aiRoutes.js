const express = require('express');
const multer = require('multer');
const aiController = require('../controllers/aiController');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for image types only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed'), false);
  }
};

// Configure upload with 10MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const router = express.Router();

// Original OpenAI endpoint (kept for backward compatibility)
router.post('/match', upload.single('image'), aiController.matchTattoo);

// New local AI match endpoint (no external APIs)
router.post('/match-local', upload.single('image'), aiController.matchTattooLocal);

module.exports = router;
