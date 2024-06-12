function createImg(req, res) {
  res
    .status(201)
    .json({ message: "Successful upload of image to S3", files: req.files });
}

module.exports = { createImg };
