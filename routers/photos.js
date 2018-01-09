const Express = require('express');
const router = Express.Router();
const FileUpload = require('./../services/file_uploads');
const mw = FileUpload.single('photo[file]');

router.get('/uploads', (req, res) => {
  res.render('photos/uploads');
});

router.post('/uploads', mw, (req, res, next) => {
  console.log('Files', req.file);

  FileUpload.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    description: req.body.photo.description,
    userId: req.session.userId,
    username: req.session.username
  })
    .then(data => {
      console.log(data);
      req.flash('success', 'Photo created!');
      res.redirect('/photos');
    })
    .catch(next);
});

router.get('/:id', (req, res) => {
  const photoId = req.params.id;
  const photos = require('./../services/data/photos.json');
  const photo = photos[photoId];
  res.render('photos/show', { photo });
});

router.get('/', (req, res) => {
  const photos = require('./../services/data/photos.json');
  res.render('photos/index', { photos });
});

router.delete('/:id', (req, res, next) => {
  FileUpload.remove(req.params.id).then(() => {
    res.redirect('/photos').catch(next);
  });
});

module.exports = router;
