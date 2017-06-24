const PhotosHelper = {};

PhotosHelper.photosPath = () => "/photos";
PhotosHelper.photosNewPath = () => "/photos/new";
PhotosHelper.photosShowPath = id => `/photos/${id}`;
PhotosHelper.photosDeletePath = id => `/photos/${id}?_method=delete`;

module.exports = PhotosHelper;
