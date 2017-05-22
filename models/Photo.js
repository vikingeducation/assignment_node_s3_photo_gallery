const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    photoName: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: false }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
