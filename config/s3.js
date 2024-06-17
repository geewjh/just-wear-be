module.exports = {
  postImageToS3,
  removeImageFromS3,
};

async function removeImageFromS3(req, res, next) {
  const AWS = require("aws-sdk");
  const s3Client = new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const { objectKey } = req.params;
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey,
  };

  try {
    await s3Client.deleteObject(deleteParams).promise();
    console.log("Removed from S3 object");
    next();
  } catch (err) {
    console.error("Can't delete from S3:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function postImageToS3(req, res, next) {
  const multer = require("multer");
  const multerUpload = multer({ storage: multer.memoryStorage() }).array(
    "images",
    5
  );

  multerUpload(req, res, async function (err) {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ error: "Failed to upload files.", details: err.message });
    }

    const sharp = require("sharp");
    const { v4: uuidv4 } = require("uuid");
    const AWS = require("aws-sdk");
    const s3Client = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    try {
      const randomID = uuidv4().split("-").pop();
      for (const file of req.files) {
        const alteredImage = await sharp(file.buffer)
          .resize(250, 250, { fit: sharp.fit.fill })
          .toFormat("jpeg", { mozjpeg: true, quality: 100 })
          .toBuffer();

        const fileBaseName = file.originalname.split(".")[0];
        const newFileName = `${randomID}-${fileBaseName}.jpeg`;

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: newFileName,
          Body: alteredImage,
          ContentType: "image/jpeg",
        };

        const uploadResponse = await s3Client.upload(uploadParams).promise();
        console.log("Image uploaded to S3:", uploadResponse);

        file.alteredImageInfo = { key: newFileName };
      }
      next();
    } catch (err) {
      console.error("Image alteration error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
}
