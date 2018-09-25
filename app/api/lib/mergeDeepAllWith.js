import {reduce,mergeDeepWith, curry} from 'ramda';

const mergeDeepAllWith = (fn,list) => reduce(mergeDeepWith(fn),[],list);

export default curry(mergeDeepAllWith);
