const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }]
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
