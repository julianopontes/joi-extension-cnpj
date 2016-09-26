'use strict';

// #######################################
// NPM MODULES
// #######################################

let Joi = require('joi');

// #######################################
// JOI EXTENSION
// #######################################

let customJoi = Joi.extend({
  base: Joi.string().length(14),
  name: 'number',
  language: {
    cnpj: 'needs to be a valid CNPJ number' // Used below as 'number.cnpj'
  },
  rules: [
    {
      name: 'cnpj',
      validate(params, value, state, options) {
        if (!_validate(value)) {
          return this.createError('number.cnpj', {v: value}, state, options);
        }

        return value;
      }
    }
  ]
});

module.exports = customJoi;

// #######################################
// CNPJ VALIDATION
// #######################################

function _validate(param) {

  var cnpj = param.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    return false;

  var size = cnpj.length - 2;
  var numbers = cnpj.substring(0, size);
  var digits = cnpj.substring(size);
  var sum = 0;
  var pos = size - 7;
  for (i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result != digits.charAt(0))
    return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (var i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;

  return !(result != digits.charAt(1));
};