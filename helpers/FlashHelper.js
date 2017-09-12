module.exports = {
  bootstrapAlertClassFor: key => {
    return (
      {
        error: "danger",
        alert: "danger",
        notice: "info"
      }[key] || key
    );
  },
  missingFlashRedirect: (req, res, path, item) => {
    req.flash("alert", `Sorry, that ${item} does not exist`);
    res.redirect(path);
  }
};
