const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const closetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Closet", closetSchema);
