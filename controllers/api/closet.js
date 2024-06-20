const Closet = require("../../models/closet");

module.exports = {
  postImageToAwsS3,
  createClothes,
  getAllClothes,
  removeClothes,
  incrementUsage,
  updateClothes,
  getClothesByID,
};

async function getClothesByID(req, res) {
  try {
    const clothesID = req.params.clothesID;
    const specificClothes = await Closet.findById(clothesID);
    res.status(200).json(specificClothes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateClothes(req, res) {
  try {
    const clothesID = req.params.clothesID;
    const updatedClothesData = req.body;
    const updatedClothes = await Closet.findByIdAndUpdate(
      clothesID,
      updatedClothesData,
      { new: true }
    );
    res.status(200).json(updatedClothes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function incrementUsage(req, res) {
  try {
    const updatedClothesItem = await Closet.findByIdAndUpdate(
      req.params.clothesID,
      { $inc: { usage: 1 } },
      { new: true }
    );
    res.status(200).json(updatedClothesItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllClothes(req, res) {
  try {
    const allClothes = await Closet.find({ user: req.user._id });
    res.status(200).json(allClothes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeClothes(req, res) {
  try {
    const removingClothesItem = await Closet.findOneAndDelete({
      _id: req.params.removingClothesID,
      user: req.user._id,
    });
    if (removingClothesItem) {
      res.status(200).json(removingClothesItem);
    } else {
      res.status(404).json({ error: "Clothes item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function postImageToAwsS3(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded or processed" });
  }

  const baseURL = process.env.MY_AWS_OBJECT_URL;
  const s3ImageURLs = req.files.map((file) => {
    const imageKey = file.alteredImageInfo.key;
    return `${baseURL}/${imageKey}`;
  });

  res.status(201).json(s3ImageURLs);
}

async function createClothes(req, res) {
  const { type, subType, material, images } = req.body;
  const clothesInfo = { type, subType, material, images };

  try {
    const newClothesItem = await Closet.create({
      ...clothesInfo,
      user: req.user._id,
    });
    res.status(201).json(newClothesItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
