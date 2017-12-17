const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  key: { type: String, required: true }
}, {
  timestamps: true
});

const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
