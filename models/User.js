const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  hashedPassword: {
    type: String,
    unique: true
  },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Photo"
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.hashedPassword = bcrypt.hashSync(value, 12);
});

UserSchema.methods.validatePassword = function(password) {
  console.log("entered function");
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = mongoose.model("User", UserSchema);
