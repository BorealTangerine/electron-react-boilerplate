import {map, uniqBy, prop} from 'ramda';
import dispatchError from './dispatchError';

function getWorkspaces(projects){
  let uniq = uniqBy(prop('workspaceCode'))(projects); //return list of unique workspaces
  return map(x=>{
    let workspace = prop('workspaceCode',x);
    return [workspace,getWorkspaceId(workspace)];})(uniq); //returns an array of workspaceCode/Id pairs
}


const getWorkspaceId = name => {
  let ws = this.store.asteroid.call('call',{...this.store.loginDetails,url:`primeapi/restapi/workspace/code/${name}`})
    .then(r => {
      switch (r.success) {
        //if success, return the workspaceID (it always returns in an array, I haven't ever seen it with more than one item)
        case true:
          return r.data[0].workspaceId;
        default:
          dispatchError(`workspace ${name} doesn't exist`);
          return null; //if false then the request failed, so dispatch error
      }
    });

  return ws;
};

function getWorkspaces(Prime,projects)
