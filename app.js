const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const mongoose = require('mongoose');
const connect = require('./mongo');

const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// middlewares
app.use(
	bodyparser({
		enableTypes: ['json', 'form', 'text']
	})
);
app.use(require('koa-static')(__dirname + '/public'));

app.use(
	views(__dirname + '/views', {
		extension: 'hbs',
		map: { hbs: 'handlebars' }
	})
);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.keys = [process.env.SECRET || 'I like pickles'];

const CONFIG = {
	key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	overwrite: true /** (boolean) can overwrite or not (default true) */,
	httpOnly: true /** (boolean) httpOnly or not (default true) */,
	signed: true /** (boolean) signed or not (default true) */,
	rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

app.use(async (ctx, next) => {
	if (!mongoose.connection.readyState) {
		await connect();
	}
	await next();
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

app.use(async (ctx, next) => {
	if (mongoose.connection.readyState) {
		await mongoose.disconnect();
	}
	await next();
});

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

module.exports = app;
