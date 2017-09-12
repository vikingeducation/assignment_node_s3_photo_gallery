const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true,
    unique: true
  },
  photos: []
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(value => {
  this.hashedPassword = bcrypt.hashSync(value, 12);
});

UserSchema.methods.validatePassword = password => {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model("User", UserSchema);
