const express = require("express");
const router = express.Router();
const clothesCtrl = require("../../controllers/api/clothes");
const s3 = require("../../config/s3");

router.post("/upload-to-s3", s3, clothesCtrl.createImg);

module.exports = router;
