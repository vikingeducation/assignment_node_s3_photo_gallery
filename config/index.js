const mongoose = require("mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

module.exports = function(DB_URL) {
  mongoose
    .connect(DB_URL, {
      useMongoClient: true
    })
    .then(db => {
      console.log("Connected to the photo gallery");
    })
    .catch(err => console.error(err));
};
