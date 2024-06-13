const express = require("express");
// const path = require("path");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/database");

const app = express();

// let corsOption = {
//   origin: ["https://xxx-xxx.vercel.app"],
// };

// app.use(cors(corsOption));

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Middleware to verify token and assign user object of payload to req.user.
app.use(require("./config/checkToken"));

// routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/closet", require("./routes/api/closet"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});
