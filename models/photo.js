const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = mongoose.Schema(
  {
    url: String,
    name: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
