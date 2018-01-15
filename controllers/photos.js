const express = require('express');
const FileUploader = require('./../services/file_upload');

const router = express.Router();

// Index
router.get(['/', '/photos'], (req, res) => {
  const photos = require('./../data/photos');
  // console.log(photos);
  res.render('photos/index', { photos });
});

// New
router.get('/photos/new', (req, res) => {
  res.render('photos/new');
});

// Create
const mw = FileUploader.single('photo[file]');

router.post('/photos', mw, (req, res, next) => {
  // console.log('Files', req.file);

  FileUploader.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  })
    .then(data => {
      // console.log(data);
      req.flash('success', 'Photo uploaded!');
      res.redirect('/photos');
    })
    .catch(next);
});

// Destroy

module.exports = router;
