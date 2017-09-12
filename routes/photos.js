const router = require('koa-router')();
const multer = require('koa-multer');
const storage = multer.memoryStorage();
const fileUpload = multer(storage);
const s3Upload = require('../services/awsWrapper');
const User = require('../models/User');

router.prefix('/photos');

router.get('/', async ctx => {
	ctx.body = 'this is a photos response!';
});

router.get('/new', async ctx => {
	await ctx.render('upload');
});

router.get('/upload-success', async ctx => {
	await ctx.render('upload-success');
});

router.post('/upload', fileUpload.single('file'), async ctx => {
	const res = await s3Upload(ctx.req.file.originalname, ctx.req.file.buffer);
	const { Key, Location } = res;

	const newPhoto = {
		key: Key,
		filename: Key,
		description: ctx.req.body.description,
		url: Location
	};

	try {
		const user = await User.findOne({ username: 'bar' });
		if (user) {
			user.photos.push(newPhoto);
			await user.save();
			return ctx.redirect('/upload-success');
		} else {
			throw Error('Invalid User, not found');
		}
	} catch (err) {
		console.error(err.stack);
	}
});

module.exports = router;
