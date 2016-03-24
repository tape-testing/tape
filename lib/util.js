var _ = require('underscore');

module.exports.defined = defined;

if (!_.isUndefined(String.prototype.trim)) {
  module.exports.trim = _.bind(Function.call, String.prototype.trim);
} else {
  module.exports.trim = trimPolyfill;
}

function defined() {
  return _.find(arguments, _.negate(_.isUndefined));
}

function trimPolyfill (str) {
  if (str === null || _.isUndefined(str)) {
    throw new TypeError("String.prototype.trim called on null or undefined");
  }
  return ("" + str).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}