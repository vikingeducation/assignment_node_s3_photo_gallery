const router = require('koa-router')();

router.get('/', async ctx => {
	await ctx.render('login', {
		title: 'Hello Koa 2!'
	});
});

router.get('/register', async ctx => {
	await ctx.render('register', {
		layout: 'layout'
	});
});

router.post('/register');

router.post('/login', async ctx => {
	// TODO: Implement this
});

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })
//
// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })

module.exports = router;
