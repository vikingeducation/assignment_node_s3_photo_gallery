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

const getPhotos = async () => {
  const photos = await Photo.find().populate("user");
  return photos;
};

module.exports = { addPhoto, getPhotos };
