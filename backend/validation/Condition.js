const isEmpty = require('./isEmpty');

const isPassword = (value) =>
  !isEmpty(value) &&
  value.length > 7 &&
  value.search(/[A-Z]/) != -1 &&
  value.search(/[0-9]/) != -1;

const isPhone = (value) =>
  !isEmpty(value) &&
  value.length === 8 &&
  value.search(/[A-Z]/) === -1 &&
  value.search(/[0-9]/) != -1;

module.exports = { isPassword, isPhone };
