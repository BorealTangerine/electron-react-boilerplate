/*@flow*/
import PrimeObject from './PrimeObject';
import type Prime from './Prime';
import {map} from 'ramda';

class CodeType extends PrimeObject {
  Prime: Prime
  constructor(Prime: Prime){
    super(Prime, 'codeType');
  }

  byWorkspaceId = async (id: number) => this.get('/workspace/' + String(await id))

  //format = (codes: Array<{}>) => map(formatCode)(codes)

}




export default CodeType;
