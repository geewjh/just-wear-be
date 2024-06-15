const express = require("express");
const router = express.Router();
const closetCtrl = require("../../controllers/api/closet");
const s3 = require("../../config/s3");

router.get("/", closetCtrl.getAllClothes);
router.post("/clothes/upload/new", s3, closetCtrl.postImageToAwsS3);
router.post("/clothes/new", closetCtrl.createClothes);

module.exports = router;
