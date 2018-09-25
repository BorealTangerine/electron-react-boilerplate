// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import login from './login/login';
import loader from './loader/loader';

const rootReducer = combineReducers({
  router,
  login,
  loader
});

export default rootReducer;
