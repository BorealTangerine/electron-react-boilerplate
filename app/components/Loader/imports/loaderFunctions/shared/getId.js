import * as R from 'ramda';


export function getWorkspaceId(code) {
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;

    //generate request options
    const newLogin = {
        ...login,
        url: '/primeapi/restapi/workspace/code/' + code
    };
    //make the request to the api by sending the data to the server, then when it returns handle the data
    const id = connection.call('call', newLogin).then((r) => {
        switch (r.success) {
            //if success, return the workspaceID (it always returns in an array, I haven't ever seen it with more than one item)
            case true:
                return {type: 'success', id: r.data[0].workspaceId};
                //if false then the request failed, sending an error message back
            case false:

                return {type: 'error', value: r.data};
            default:
                return r;
        }
    });
    return id;
}
//API ENDPOINT: /primeapi/restapi/project/workspace/{workspaceId}/code/{code}
export async function getProjectId(projectCode,workspaceId){
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;

    const newLogin = {
        ...login,
        url: '/primeapi/restapi/project/workspace/'+await workspaceId+'/code/'+projectCode,
    };
    const id = connection.call('call',newLogin).then((r) => {
        switch (r.success) {
            //if success, return the projectID
            case true:
                return {type: 'success', id: r.data.projectId};
                //if false then the request failed, send an error message back
            case false:

                return {type: 'error', value: r.data};
            default:
                return r;
        }
    });
    return id;

}
//returns an array of activities existing in the project with the ID given.
export function getActivities(projectId){
    const dispatchError = error => {

        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }
    const connection = this.store.asteroid;
    const login = this.store.loginDetails;
    const newLogin = {
        ...login,
        url: 'primeapi/restapi/activity/project/'+projectId
    };
    return (connection.call('call',newLogin).then((r) => {
        switch (r.success) {
            //if success, return the activityId
            case true:
                return {type: 'success', id: r.data.activityId};
                //if false then the request failed, send an error message back
            case false:
                dispatchError(`error`)
                return {type: 'error', value: r.data};
            default:
                return r;
        }
    }));
}

//View an Activity by Project ID and Activity Code
//Endpoint: /primeapi/restapi/activity/project/{id}/code/{code}
export async function getActivityId(project,activityCode){
    const dispatchError = error => {

        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }
    const projectId = project.projectId;
    const projectCode = project['Project ID'];

    const login = this.store.loginDetails;
    const connection = this.store.asteroid;
    const url = '/primeapi/restapi/activity/project/'+await projectId+'/code/'+activityCode;

    const response = await connection.call('call',{...login,url});

    switch (response.success) {
        case true:
            return response.data[0].activityId; //the response data returns wrapped in an array for some reason
        case false:
            dispatchError(`Activity with ID ${activityCode} does not exist in project ${projectCode}.`)
            return null;
        default:
            return response;
    }
}
