const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
