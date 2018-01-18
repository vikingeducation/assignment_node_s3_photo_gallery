const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    url: String,
    description: String
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
