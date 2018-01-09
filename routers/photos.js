const Express = require('express');
const router = Express.Router();
const FileUpload = require('./../services/file_uploads');
const mw = FileUpload.single('photo[file]');

router.get('/upload', (req, res) => {
  res.render('photos/uploads');
});

router.post('/photos', mw, (req, res, next) => {
  console.log('Files', req.file);

  FileUpload.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  })
    .then(data => {
      console.log(data);
      req.flash('success', 'Photo created!');
      res.redirect('/photos');
    })
    .catch(next);
});

module.exports = router;
