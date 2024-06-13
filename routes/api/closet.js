const express = require("express");
const router = express.Router();
const closetCtrl = require("../../controllers/api/closet");
const s3 = require("../../config/s3");

router.post("/clothes/upload/new", s3, closetCtrl.uploadImg);
router.post("/clothes/new", closetCtrl.create);

module.exports = router;
