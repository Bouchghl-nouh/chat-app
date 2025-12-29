const express = require("express");
const presign = require("../controllers/presignController");
const image = require("../controllers/imageController");

const router = express.Router();

// Presigned URLs
router.post("/upload-url", presign.getUploadUrl);
router.get("/download-url", presign.getDownloadUrl);

router.get("/images", image.transformImage);

module.exports = router;
