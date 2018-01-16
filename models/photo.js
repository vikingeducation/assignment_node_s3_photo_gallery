const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    filename: String,
    url: String
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
