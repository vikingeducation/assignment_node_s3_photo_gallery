const User = require('../models/User');
const router = require('koa-router')();
const passport = require('koa-passport');

router.get('/', async ctx => {
	// if (!ctx.isAuthenticated()) {
	// 	return await ctx.render('login', {
	// 		title: 'Hello Koa 2!'
	// 	});
	// }
	await ctx.render('home', { user: ctx.state.user });
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

		await ctx.login(user);
	} catch (err) {
		return next(err);
	}

	await ctx.redirect('/');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
);

module.exports = router;
