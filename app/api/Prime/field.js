import PrimeObject from './PrimeObject';
import type Prime from './Prime';
import {map} from 'ramda';
import mergeDeepAll from '../lib/mergeDeepAll';

class Field extends PrimeObject {
  Prime: Prime
  constructor(Prime: Prime){
    super(Prime, 'field');
  }

  format = (fields) => fields.length >0? mergeDeepAll(map(formatField)(fields)) : {}
}


function formatField(field) {
  let name = field.name;
  let value = field.value;
  return {
    textFlexMap:{[name]:value},
    costFlexMap:{[name]:value},
    otherFlexMap:{[name]:value}
  };

}
export default Field;
