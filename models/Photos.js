const mongoose = require("mongoose");
;

const PhotosSchema = mongoose.Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: "User"}
  name: { type: String, required: true},
  url: { type: String, required: true },
  description: { type: String, required: false }
}, {
	timestamps: true
});


const Photos = mongoose.model("Photos", PhotosSchema);

module.exports = Photos;