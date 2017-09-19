const loggedInOnly = (req, res, next) => {
  return req.isAuthenticated() ? next() : res.redirect("/");
};

const loggedOutOnly = (req, res, next) => {
  return req.isAuthenticated() ? res.redirect("/") : next();
};

module.exports = {
  loggedInOnly,
  loggedOutOnly
};
