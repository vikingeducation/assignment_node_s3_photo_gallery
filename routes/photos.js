const router = require('koa-router')();
const multer = require('koa-multer');
const storage = multer.memoryStorage();
const upload = multer(storage);

router.prefix('/photos');

router.get('/', async ctx => {
	ctx.body = 'this is a photos response!';
});

router.get('/new', async ctx => {
	await ctx.render('upload');
});

router.post('/upload', upload.single('file'), async ctx => {
	console.log('BODY', ctx.request.file);
});

module.exports = router;
