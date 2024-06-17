const AWS = require("aws-sdk");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

// initialize AWS S3 with credentials
const s3Client = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});
console.log("Initialized S3 client configuration:", s3Client);

// random unique identifier for the image
function generateRandomID() {
  const uuid = uuidv4();
  const segments = uuid.split("-");
  const lastSegment = segments[segments.length - 1];
  return lastSegment;
}

// setup multer for file upload handling
const multerUpload = multer({ storage: multer.memoryStorage() }).array(
  "images",
  5
);

module.exports = function postToS3(req, res, next) {
  multerUpload(req, res, async function (err) {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ error: "Failed to upload files.", details: err.message });
    }
    try {
      const randomID = generateRandomID();
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
};

// https://vercel.com/templates/next.js/aws-s3-image-upload-nextjs
// https://www.youtube.com/watch?v=SeYABhj0WXM
// https://www.youtube.com/watch?v=eQAIojcArRY&t=1236s
