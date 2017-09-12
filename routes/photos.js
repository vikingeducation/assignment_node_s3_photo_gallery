const router = require("koa-router")();

router.prefix("/photos");

router.get("/", function(ctx, next) {
  ctx.body = "this is a photos response!";
});

router.get("/:id", function(ctx, next) {
  ctx.body = "this is a photos/bar response";
});

module.exports = router;
