import {reduce,mergeDeepLeft} from 'ramda';

const mergeDeepAll = list => reduce(mergeDeepLeft,[],list);

export default mergeDeepAll;
