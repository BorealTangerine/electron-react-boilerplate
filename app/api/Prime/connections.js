/* @flow */

/* axios calls to the accompanying server */

import axios from 'axios';
import type { Axios } from 'axios';

function createInstance(username, password, url) {
  return axios.create({
    baseURL: `${url}/primeapi/restapi/`,
    auth: { username, password }
  });
}

// a wrapper function for resolving promises returned by Call's axios methods.
/* function resolve(promise){
  return promise
    .then(r=>r.data)
    .catch(r=>r.response);
} */

function parseStatus(status) {
  switch (status) {
    case 401:
      return { reason: 'Invalid Username or Password', type: 'user' };
    default:
      return { reason: `${status} error occurred`, type: 'other' };
  }
}

function getReason({ response, request }) {
  if (response) {
    const { status } = response;
    return parseStatus(status);
  }
  if (request) {
    return { reason: 'Invalid URL', type: 'url' };
  }
  return { reason: 'Unknown Error Occurred', type: 'other' };
}

function parseError(error) {
  return { success: false, error: getReason(error) };
}

/* class containing methods to send calls to the accompanying server.
    get: (url)
    post: (url, data)
    put: (url, data)

*/

export default class Call {
  instance: Axios;

  constructor(url: string, username: string, password: string) {
    this.instance = createInstance(username, password, url);
  }

  static login = (username: string, password: string, url: string) => {
    const instance = createInstance(username, password, url);
    return instance({
      url: '/',
      validateStatus: status => status === 404
    })
      .then(() => ({ success: true }))
      .catch(parseError);
  };

  get = (url: string) => this.instance.get(url);

  post = (url: string, data: {} | [{}]) => this.instance.post(url, data);

  put = (url: string, data: {} | [{}]) => this.instance.put(url, data);
}

/* test of operation
let x = new Call( 'https://rpcuk-prime-eu.oracleindustry.com/primeapi/restapi/','james.bentley@rpc.uk.com','8Cv$V/3V');


x.get('/workspace/4').then(x=>{console.log(x);});

*/
