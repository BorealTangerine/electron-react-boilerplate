/*@flow*/

import mergeDeepAllWith from './mergeDeepAllWith';
import {map, curry, concat} from 'ramda';


// (prop, object) ⇒ {prop:object}
const sortByProp = curry(function sortByProp(prop: string, object: {}){
  let key = object[prop];

  return {[key]:[object]};
});

// (prop, Array<object>) ⇒ Map<(prop:Array<object>)>
const sortArrayByProp = curry(function sortArrayByProp( prop: string, array: Array<{}>): {[workspace: string]: [{}]}{

  let sorted = map(sortByProp(prop))(array);
  return mergeDeepAllWith(concat)(sorted);
});



export {sortByProp, sortArrayByProp};
