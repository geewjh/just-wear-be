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

// routes
app.use("/api/users", require("./routes/api/users"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});
