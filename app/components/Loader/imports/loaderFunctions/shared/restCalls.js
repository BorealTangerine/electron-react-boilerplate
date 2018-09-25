import {curry} from 'ramda';

export function get(url){return  this.store.asteroid.call('call',{...this.store.loginDetails,url:url, method:'get'});}

export const post = curry(function(url,data){return this.store.asteroid.call('call',{...this.store.loginDetails,url:url,data:data,method:'post'});
});

export const put = curry(function(url,data){return this.store.asteroid.call('call',{...this.store.loginDetails,url:url,data:data,method:'put'});
});
