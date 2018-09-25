import { Nothing } from 'sanctuary';
import { mergeDeepRight } from 'ramda';
import type { Action, State } from './types';
import loaders from '../../components/Loader/loaders';

const initialState = {
  loaders
};

export default function loader(state: State = initialState, action: Action) {
  const { data, type } = action;
  switch (type) {
    case 'SEND_EXCEPTION':
      return mergeDeepRight(state)(data);
    default:
      return state;
  }
}
