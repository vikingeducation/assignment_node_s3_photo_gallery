const router = require('koa-router')();
const multer = require('koa-multer');
const storage = multer.memoryStorage();
const fileUpload = multer(storage);
const { s3Upload, s3Delete } = require('../services/awsWrapper');
const User = require('../models/User');

router.prefix('/photos');

router.get('/', async ctx => {
	ctx.body = 'this is a photos response!';
});

//show
router.get('/show/:id', async ctx => {
	ctx.body = 'UPLOADED';
});

router.get('/new', async ctx => {
	await ctx.render('upload');
});

router.post('/upload', fileUpload.single('file'), async ctx => {
	const res = await s3Upload(ctx.req.file.originalname, ctx.req.file.buffer);
	const { Key, Location } = res;

	const newPhoto = {
		key: Key,
		filename: ctx.req.file.originalname,
		description: ctx.req.body.description,
		url: Location
	};

	try {
		const user = ctx.state.user;
		if (user) {
			user.photos.push(newPhoto);
			await user.save();
			return ctx.redirect('/');
		} else {
			throw Error('Invalid User, not found');
		}
	} catch (err) {
		console.error(err.stack);
	}
});

router.get('/delete/:key', async ctx => {
	const res = await s3Delete(ctx.params.key);
	console.log(res);
	try {
		const user = ctx.state.user;
		if (user) {
			user.photos = user.photos.filter(photo => photo.key !== ctx.params.key);
			await user.save();
			return ctx.redirect('/');
		} else {
			throw Error('Invalid User, not found');
		}
	} catch (err) {
		console.error(err.stack);
	}
});

module.exports = router;
