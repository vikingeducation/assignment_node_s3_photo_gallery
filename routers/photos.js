const express = require('express');
const router = express.Router();
const FileUploader = require('../services/file_uploader');
const { loggedInOnly } = require('../services/session');
const Photo = require('../models').Photo;

router.get('/', loggedInOnly, (req, res) => {
  Photo.find()
    .populate('user')
    .then(photos => res.render('photos/index', { photos }))
    .catch(e => res.status(500).send(e.stack));
});

router.get('/new', loggedInOnly, loggedInOnly, (req, res) => {
  res.render('photos/new');
});

const mw = FileUploader.single('photo[file]');
router.post('/', loggedInOnly, mw, (req, res) => {
  FileUploader.upload(req.file)
    .then(photoData => {
      let photo = new Photo({
        user: req.user,
        fileName: req.file.originalname,
        url: photoData.Location,
        key: photoData.Key
      });

      req.user.photos.push(photo.toObject());
      req.user.save();
      return photo.save();
    })
    .then(() => {
      req.flash('success', 'Uploaded!');
      res.redirect('/photos/new');
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get('/:id', loggedInOnly, (req, res) => {
  Photo.findById(req.params.id)
    .populate({
      path: 'user',
      populate: {
        path: 'photos',
        options: {
          limit: 3
        }
      }
    })
    .then(photo => {
      if (!photo) throw 'No Photo';
      res.render('photos/show', { photo });
    })
    .catch(e => res.status(500).send(e));
});

router.delete('/:id', loggedInOnly, (req, res) => {
  Photo.findById(req.params.id)
    .populate('user')
    .then(photo => {
      if (!photo) throw 'No Photo';
      if (photo.user.id !== req.user.id) throw 'Unauthorized';

      return FileUploader.remove(photo);
    })
    .then(() => {
      req.flash('success', 'Photo deleted.');
      res.redirect('/');
    })
    .catch(e => res.status(500).send(e));
});

module.exports = router;
