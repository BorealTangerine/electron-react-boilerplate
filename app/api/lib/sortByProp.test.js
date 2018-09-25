import {sortArrayByProp} from './sortByProp';

let data = [{workspace:'A',value:1},{workspace:'A',value:2},{workspace:'B',value:1},]

test('reduces the data by workspace',()=>{
  expect(sortArrayByProp('workspace')(data)).toEqual({A:[{workspace:'A',value:1},{workspace:'A',value:2}], B:[{workspace:'B',value:1}]})
})
