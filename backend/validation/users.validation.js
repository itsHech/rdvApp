const isEmpty = require('./isEmpty');
const validator = require('validator');
const { isPassword, isPhone } = require('./Condition');
const fileFormat = require('./fileFormat');

module.exports = function ValidateUser(data, file) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirm_password = !isEmpty(data.confirm_password)
    ? data.confirm_password
    : '';
  data.birthday = !isEmpty(data.birthday) ? data.birthday : '';
  data.governorate = !isEmpty(data.governorate) ? data.governorate : '';
  data.profession = !isEmpty(data.profession) ? data.profession : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email format required';
  }
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }
  if (data.password != data.confirm_password) {
    errors.password = 'The password is not identical';
  }
  if (!isPassword(data.password)) {
    errors.password = 'Password format required';
  }
  if (!validator.isDate(data.birthday)) {
    errors.birthday = 'Birthday format required';
  }
  if (validator.isEmpty(data.governorate)) {
    errors.governorate = 'Governorate is required';
  }
  if (validator.isEmpty(data.profession)) {
    errors.profession = 'Profession is required';
  }
  if (!isPhone(data.phone)) {
    errors.phone = 'Phone format required';
  }
  if (file === '' || fileFormat(file) === false) {
    errors.file = 'File format required';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
