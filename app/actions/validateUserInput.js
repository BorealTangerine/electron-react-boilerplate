// @flow
import {allPass, compose, length, lt} from 'ramda';
import validator from 'validator';

export function isValidInput(input: ?string): boolean {
  return allPass([hasLength])(input)
}

const hasLength = compose(lt(0),length)

export function isValidURL(input: ?string): boolean {
  return allPass([validateURL])(input)
}


function validateURL(input: ?string): boolean {
  return typeof input === 'string'? validator.isURL(input) : false
}
