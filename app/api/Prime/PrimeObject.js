/*@flow*/
import type Prime from './Prime';

export default class PrimeObject {
  Prime: Prime
  endpoint: string
  constructor(Prime: Prime, endpoint: string){
    this.Prime = Prime;
    this.endpoint = `/${endpoint}/`
  }

  post=(data: {})=> this.Prime.post(this.endpoint, data);

  put= (data: {})=> this.Prime.put(this.endpoint, data);


  get=(url: string)=>this.Prime.get(this.endpoint+url);

}
