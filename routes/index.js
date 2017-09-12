const User = require('../models/User');

const router = require('koa-router')();

router.get('/', async ctx => {
	await ctx.render('login', {
		title: 'Hello Koa 2!'
	});
});

router.get('/register', async ctx => {
	await ctx.render('register');
});

router.post('/register', async (ctx, next) => {
	const formData = {
		username: ctx.request.body.username,
		password: ctx.request.body.password
	};

	try {
		const user = await User.create(formData);
	} catch (err) {
		await next(err);
	}

	await ctx.redirect('/register');
});

router.post('/login', async ctx => {
	// TODO: Implement this
});

module.exports = router;
