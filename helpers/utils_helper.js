const UtilsHelper = {};

UtilsHelper.debug = obj => {
  return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
};

UtilsHelper.json = obj => {
  return JSON.stringify(obj, null, 2);
};

UtilsHelper.canDelete = (user, photo) => {
  return user.id.toString() === photo.user.id.toString();
};

module.exports = UtilsHelper;
