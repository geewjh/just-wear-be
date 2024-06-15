const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

//AWS S3 Client Setup
const awsS3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

//Multer-S3 Storage Engine Configuration
const awsS3Bucket = multerS3({
  s3: awsS3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldname: file.fieldname, contentType: file.mimetype });
  },
  key: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//Multer Middleware Setup
const post = multer({
  storage: awsS3Bucket,
}).array("images", 4);

//Middleware for Uploading Files to S3
module.exports = function postToAwsS3(req, res, next) {
  console.log("s3 route hit!");
  console.log("Request files:", req.files);
  post(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Upload successful:", req.files);
    return next();
  });
};

// https://vercel.com/templates/next.js/aws-s3-image-upload-nextjs
// https://www.youtube.com/watch?v=SeYABhj0WXM
// https://www.youtube.com/watch?v=eQAIojcArRY&t=1236s
