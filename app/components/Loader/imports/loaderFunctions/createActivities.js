/* XXX

API ENDPOINTS
Create an Activity: POST /primeapi/restapi/activity
Create Activities: POST /primeapi/restapi/activity/batch
View Activities by WBS: /primeapi/restapi/activity/wbsId/{id}
View WBS by Project ID: /primeapi/restapi/wbs/project/{id}
View Activities by Project ID: GET /primeapi/restapi/activity/project/{id}
REQUIRED FIELDS
activtyCode
activityName
projectId -will be got via projectCode and workspaceCode
workspaceId - will be got from workspaceCode

*/

/* TODO

CREATING/UPDATING
convert file data into json format -processInput✓
get workspaceIds for all workspaces given - mapIds✓
get projectIds for all projects given✓
get wbsIds for all projects given✓
check if any activities given already exist✓
if activity exists, add to 'update' object✓
if it doesn't exist, add to 'create' object
POST create to endpoint✓
PUT update to endpoint✓

CONFIGURED FIELDS

CODES

*/

/*--------------------IMPORTS--------------------*/
import {xlsxToJson2} from './shared/newJson';
import mapIds, {mapProjects} from './shared/mapIds';
import {getValue, getActivitiesByProjectId} from './shared/getValue';
import * as R from 'ramda';
import mergeDeepAll from './shared/mergeDeepAll';
/*-----------------------------------------------*/




//data is the file data uploaded by the user.
async function main(data){

    const getCodeTypeByWS = async (id) => {


        let codeTypes = this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeType/workspace/${await id}`}).then(data=>data.data);

        return codeTypes;
    };

    const codeMap = async (c,activity, types) => {
        let codeValue = c.value;
        let codeType = c.type;
        let workspaceCode = activity.workspaceCode;
        let workspace = R.find(R.propEq('workspaceCode',workspaceCode))(types);
        let type = R.find(R.propEq('codeTypeCode',codeType))(await workspace.codeTypes);
        if (type===undefined) {
            dispatchError(`codeType ${codeType} does not exist in workspace ${activity.workspaceCode}`);
            return {};
        }
        let codeTypeId = type.codeTypeId;

        let codeValueId = await this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeValue/code/${codeValue}/codeType/${codeTypeId}`}).then(x=>x.data[0].codeValueId);

        let x = {codeType:{codeTypeId:codeTypeId,},codeValue:{codeValueId:codeValueId, codeTypeId:codeTypeId}};

        return x;

    };

    const fieldMap = (f) => {
        let fieldName = f.name;
        let value = f.value;
        return {textFlexMap:{[fieldName]:value},costFlexMap:{[fieldName]:value},otherFlexMap:{[fieldName]:value}};
    };



    var dispatchError = error => {
        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }

    const findExistingActivity = (activity,activities) => R.find(R.where({activityCode:activity.activityCode}))(activities)

    /*PRELIMINARY DATA GATHERING*/
    const activitiesJson = await xlsxToJson2(data,'Activities'); //activities data in a workable format
    console.log(activitiesJson);
    const workspaceCodes = getValue(activitiesJson,'workspaceCode'); //unique list of workspace codes in the data file
    const workspaceArray = await mapIds.call(this, workspaceCodes); // workspace codes and their internal IDs (array of arrays)
    console.log(workspaceArray);
    const workspaceMap = new Map(workspaceArray);//workspaceArray converted to a map object


    //let codeTypes = getCodeTypeByWS(workspaceId);
    let getCodeTypes = workspaceArray => R.map(x=>({workspaceCode: x[0],workspaceId:x[1],codeTypes:getCodeTypeByWS(x[1])}))(workspaceArray)



    const projectIds = R.uniq(R.map(R.props(['projectCode','workspaceCode']))(activitiesJson) );//unique list of projectId/workspaceId pairs
    console.log(projectIds);

    const projectArray = await mapProjects.call(this,projectIds,workspaceMap); //gets the internal ID for each 'Project ID' in the data json, returns a copy of activitiesJson with this value appended as 'projectId' in each object

    const existingProjects = (R.reject(R.equals(undefined),projectArray));

    const activitiesArray =existingProjects.map( x=>{return {...x,activities:getActivitiesByProjectId.call(this,x.projectId)};
    }); //returns a new copy of existingProjects with the activities for each project

    console.log(activitiesArray);


    let codeTypes = getCodeTypes(workspaceArray)

    const processActivity = async activity => {

        let codes = R.prop('codes',activity);
        let mappedCodes = R.map(x=>codeMap(x,activity,codeTypes))(codes);

        let codeArray =Promise.all(mappedCodes)

        let fields = R.prop('fields',activity);
        let mappedFields = R.map(fieldMap)(fields);
        let mergedFields = mergeDeepAll(mappedFields);

        let processedActivity = {...activity,projectConfiguredFields:mergedFields,projectCodes: codeArray}
        console.log(processedActivity);

        let project = R.find(R.whereEq({projectCode:activity.projectCode,workspaceCode:activity.workspaceCode}))(activitiesArray); //finds the object in activitiesArray matching the given properties

        if (project) {
            let activities = await project.activities; //has 3 properties: success,status & data
            let existingActivity = () => {
                if (R.propEq('status',200,activities)){
                    return findExistingActivity(activity,activities.data);
                } else {
                    return undefined;
                }
            };
            let mergedActivity = R.mergeDeepLeft(processedActivity,existingActivity);

        }

        return;
    }
    let processActivities = R.map(processActivity)(activitiesJson);

}




export default main;
