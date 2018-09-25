import {find, match} from 'ramda';

export default function dispatchError(error){
  if (!find(match(error))(this.store.exceptions)){
    this.dispatch({type:'SEND_EXCEPTIONS',data:error});
  }
} //checks if the error is already displayed, if it isn't then dispatch the error.
