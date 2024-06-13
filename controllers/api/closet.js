const Closet = require("../../models/closet");

const AWS_S3_OBJECT_URL = process.env.AWS_S3_OBJECT_URL;

function uploadImg(req, res) {
  const { files } = req;
  const imgURLs = files.map((img) => {
    return `${AWS_S3_OBJECT_URL}/${img.key}`;
  });
  console.log("convert image to url:", imgURLs);
  res.status(201).json({
    message: "nice, you did it! succesful upload of image to s3",
    imageURLs: imgURLs,
  });
}

async function create(req, res) {
  console.log("req.body:", req.body);
  const { name, type, material, images } = req.body;
  const clothesInfo = { name, type, material, images };

  try {
    const newClothesItem = await Closet.create({
      ...clothesInfo,
    });
    res.status(201).json({
      status: "success",
      data: {
        clothes: newClothesItem,
      },
    });
  } catch (err) {
    console.log("Error saving it to db:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadImg, create };
