const mongoose = require("mongoose");
const Photo = require("../models/Photo");

const addPhoto = async (url, filename, userId) => {
  const photo = new Photo({
    url,
    filename,
    user: userId
  });

  try {
    return await photo.save();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addPhoto };
