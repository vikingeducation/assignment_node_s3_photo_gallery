const DebugHelper = {};

DebugHelper.debug = item => {
  console.log(item);
  debugger;
};

module.exports = DebugHelper;
