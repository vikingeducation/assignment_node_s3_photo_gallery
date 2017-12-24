const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    photoName: { type: String },
    key: { type: String },
    url: { type: String },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;