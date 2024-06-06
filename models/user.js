const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// passwords mostly have min. length of 8 now

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      trim: true,
      minLength: 8,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

mongoose.exports = mongoose.model("User", userSchema);
