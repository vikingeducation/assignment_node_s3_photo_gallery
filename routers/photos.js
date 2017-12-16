const express = require('express');
const router = express.Router();
const FileUploader = require('../services/file_uploader');

const newPhotoAction = (req, res) => {
  res.render('photos/new');
};

router.get('/', newPhotoAction);
router.get('/new', newPhotoAction);

const mw = FileUploader.single('photo[file]');
router.post('/', mw, (req, res) => {
  FileUploader.upload(req.file)
    .then(() => {
      req.flash('success', 'Uploaded!');
      res.redirect('/photos/new');
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
