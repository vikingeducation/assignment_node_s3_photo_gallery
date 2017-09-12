const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  photos: []
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
