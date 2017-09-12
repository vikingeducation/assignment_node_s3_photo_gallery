const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  }
}, 
{
  timestamps: true
});

module.exports = mongoose.model("Photo", PhotoSchema);