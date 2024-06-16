const Closet = require("../../models/closet");

module.exports = { postImageToAwsS3, createClothes, getAllClothes };

async function getAllClothes(req, res) {
  try {
    const allClothes = await Closet.find({ user: req.user._id });
    res.status(201).json(allClothes);
  } catch (err) {
    console.log("Error retrieving all clothes of said user from the db:", err);
    res.status(500).json({ error: err.message });
  }
}

function postImageToAwsS3(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded or processed" });
  }

  const baseURL = process.env.AWS_S3_OBJECT_URL;
  const s3ImageURLs = req.files.map((file) => {
    const imageKey = file.alteredImageInfo.key;
    return `${baseURL}/${imageKey}`;
  });

  res.status(201).json(s3ImageURLs);
}

async function createClothes(req, res) {
  console.log("req.body:", req.body);
  const { type, subType, material, images } = req.body;
  const clothesInfo = { type, subType, material, images };

  try {
    const newClothesItem = await Closet.create({
      ...clothesInfo,
      user: req.user._id,
    });
    res.status(201).json(newClothesItem);
  } catch (err) {
    console.log("Error saving it to db:", err);
    res.status(500).json({ error: err.message });
  }
}
