const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  url: String,
  name: String
});

const User = mongoose.model("User", PhotoSchema);

module.exports = User;
