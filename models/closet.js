const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const closetSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    subType: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    usage: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Closet", closetSchema);
