
import uniq from 'lodash/uniq';


//returns a list of values from the chosen field 'value', removing any duplicates.
export function getValue(json,value){
    const values =  json.map(entry=>entry[value]);

    return uniq(values);
}


//returns all activities for a given project ID
export async function getActivitiesByProjectId(projectId){
    console.log(projectId);
    const connection = this.store.asteroid;
    const login = this.store.loginDetails
    let url = '/primeapi/restapi/activity/project/'+projectId;
    let activities = await connection.call('call',{...login,url:url});
    return activities;
}
