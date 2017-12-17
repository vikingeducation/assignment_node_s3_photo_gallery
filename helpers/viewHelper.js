const ViewHelper = {
  any: item => {
    if (item) return item.length;
  },
  match: (item1, item2) => {
    return item1 === item2;
  }
};

module.exports = ViewHelper;
