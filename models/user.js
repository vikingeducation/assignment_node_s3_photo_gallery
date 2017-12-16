const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const md5 = require('md5');
const uuid = require('uuid/v4');

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
  this.token = md5(`${ this.email }${ uuid() }`);
  next();
});

UserSchema.virtual("password")
  .set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
