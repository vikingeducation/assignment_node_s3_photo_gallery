const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Photo'
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual('password')
  .get(function() {
    return this.passwordHash;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
