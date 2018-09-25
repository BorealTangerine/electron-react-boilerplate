import { getWorkspaceId, getProjectId, getActivities } from './getId';
import {getValue} from './getValue';
import * as R from 'ramda';



//returns an array of key-value pairs, sending each workspaceId from the template data and assigning it to its internal id.
export default function mapIds(workspaceNames) {
    const dispatchError = error => {

        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }
    const mapFunction = (name)=>{
        let id = getWorkspaceId.call(this,name)
            .then(x=>{
                if (x.type === 'error') {
                    dispatchError('The workspace with ID ' + name + ' does not exist or has been deleted');
                    return undefined;
                } else {
                    return x.id;
                }
            });
        return [name,id]
    };
    var map = R.map(mapFunction)(workspaceNames);


    //wraps the array in a promise that resolves when all the promises in the map array have resolved.
    return  map;
}
//json is the base data object
//idMap is a map type object created from the output of the mapIds function.

//retrieves projectIds and appends them to each object in a copy of 'json'
export function mapProjects(json,idMap){
    const dispatchError = error => {

        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }
    const map = json.map(async (x)=>{
        console.log(x);
        let workspaceCode = x[1];
        let workspaceId = idMap.get(workspaceCode);
        let projectCode = x[0];
        let response = await getProjectId.call(this,projectCode,workspaceId)
        if (response.type === 'success'){
            return {projectCode:projectCode,workspaceCode:workspaceCode,projectId:response.id, workspaceId:workspaceId};} else if (response.type === 'error'){
            dispatchError('Project with ID '+projectCode+' does not exist in workspace '+workspaceCode)
        }
    });

    return Promise.all(map)
}
//json is the base data object
//idMap is a map type object containing projectCode:projectId pairs
export function mapActivities(json,idMap){

    const map = json.map((x)=>{
        let projectCode = x.projectId;
        let projectId = idMap.get(projectCode);
        let response = getActivities.call(this,projectId);
        if (response.type === 'success'){
            return [x.activtyId,response.data];
        }

    });
    return Promise.all(map);
}
