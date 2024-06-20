const express = require("express");
const router = express.Router();
const closetCtrl = require("../../controllers/api/closet");
const s3 = require("../../config/s3");

router.get("/get/clothes/:clothesID", closetCtrl.getClothesByID);
router.get("/get-all", closetCtrl.getAllClothes);
router.delete(
  "/clothes/delete/:removingClothesID/:objectKey",
  s3.removeImageFromS3,
  closetCtrl.removeClothes
);
router.post(
  "/clothes/upload/new",
  s3.postImageToS3,
  closetCtrl.postImageToAwsS3
);
router.post("/clothes/new", closetCtrl.createClothes);
router.patch("/increment-usage/:clothesID", closetCtrl.incrementUsage);
router.patch("/update-clothes/:clothesID", closetCtrl.updateClothes);

module.exports = router;
