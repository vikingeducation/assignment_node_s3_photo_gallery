const mongoose = require("mongoose");
const User = require("../models/User");

const addUser = async data => {
  const { fname, lname, email } = data;
  const user = new User({
    fname,
    lname,
    email
  });
  try {
    return await user.save();
  } catch (err) {
    console.log(err);
  }
};

const addUserPhoto = async (url, id) => {
  try {
    return await User.update({ _id: id }, { $push: { photos: url } });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addUser, addUserPhoto };
