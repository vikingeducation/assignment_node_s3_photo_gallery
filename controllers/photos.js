const express = require('express');
const FileUploader = require('./../services/file_upload');
const h = require('./../helpers');

const router = express.Router();

// Index
router.get('/', (req, res) => {
  const photos = require('./../data/photos');
  console.log(photos);
  res.render('photos/index', { user: req.user, photos });
});

// New
router.get('/new', (req, res) => {
  res.render('photos/new');
});

// Create
const mw = FileUploader.single('photo[file]');

router.post('/', mw, (req, res, next) => {
  console.log('Files', req.file);

  FileUploader.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  })
    .then(data => {
      console.log(data);
      req.flash('success', 'Photo uploaded!');
      res.redirect(h.photosPath());
    })
    .catch(next);
});

// Destroy
router.delete('/:id', (req, res, next) => {
  FileUploader.remove(req.params.id)
    .then(() => {
      res.redirect(h.photosPath());
    })
    .catch(next);
});

module.exports = router;
