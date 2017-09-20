const _ = require('lodash');


const UtilsHelper = {};


UtilsHelper.debug = (obj) => {
  return `<pre>${ JSON.stringify(obj, null, 2) }</pre>`;
};


UtilsHelper.json = (obj) => {
  return JSON.stringify(obj, null, 2);
};


UtilsHelper.isEmpty = (obj) => {
  return _.isEmpty(obj);
};




module.exports = UtilsHelper;






