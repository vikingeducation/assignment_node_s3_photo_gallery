const DateHelper = {};

DateHelper.twoByTwo = function(key) {
  const dateAndTime = new Date(key);
  return (
    dateAndTime.getMonth() +
    1 +
    "/" +
    dateAndTime.getDate() +
    "/" +
    dateAndTime.getFullYear()
  );
};

DateHelper.time = function(key) {
  const dateAndTime = new Date(key);
  return dateAndTime.getHours() + ":" + dateAndTime.getMinutes();
};

DateHelper.datetime = function(key) {
  const dateAndTime = new Date(key);
  return dateAndTime.toLocaleString();
};

module.exports = DateHelper;
