const mongoose = require("mongoose");
const User = require("../models/User");

const addUser = async data => {
  const { fname, lname, email, password } = data;
  const user = new User({
    fname,
    lname,
    email,
    password
  });
  try {
    return await user.save();
  } catch (err) {
    console.log(err);
  }
};

const addUserPhoto = async (userId, photoId) => {
  try {
    return await User.update({ _id: userId }, { $push: { photos: photoId } });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addUser, addUserPhoto };
