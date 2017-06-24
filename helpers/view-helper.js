const ViewHelper = {};

ViewHelper.isPhotoOwnedByUser = (userId, photoOwnerId) => {
  return userId.toString() === photoOwnerId.toString();
};

module.exports = ViewHelper;
