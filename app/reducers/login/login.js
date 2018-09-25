// @flow
import { mapObjIndexed, mergeDeepRight, prop } from 'ramda';
import type { Action, State } from './types';

const initialState = {
  error: false,
  loggedIn: false,
  login: {
    username: '',
    password: '',
    url: ''
  },
  fields: {
    username: {
      value: '',
      valid: true,
      error: 'Please enter your username',
      defaultError: 'Please enter your username'
    },
    password: {
      value: '',
      valid: true,
      error: 'Please enter your password',
      defaultError: 'Please enter your password'
    },
    url: {
      value: '',
      valid: true,
      error: 'Please enter a valid URL',
      defaultError: 'Please enter a valid URL'
    }
  }
};

export default function loginReducer(
  state: State = initialState,
  action: Action
) {
  const { type, data } = action;
  const { fields } = state;

  switch (type) {
    case 'USER_LOGIN':
      return {
        ...state,
        loggedIn: true,
        login: mapObjIndexed(prop('value'))(fields)
      };
    case 'USER_LOGOUT':
      return initialState;
    case 'CHANGE_VALUE':
      return { ...state, fields: mergeDeepRight(fields)(data) };
    default:
      return state;
  }
}
