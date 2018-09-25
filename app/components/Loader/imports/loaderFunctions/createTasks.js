
// NOTE: required fields: itemCode, project(id), tasksName, activityId* check if required

/* XXX
API ENDPOINTS
Create a Task: POST /primeapi/restapi/workManagerTask/
Batch Create Tasks:
  POST /primeapi/restapi/workManagerTask/batch

View Tasks by Project ID:
  GET /primeapi/restapi/workManagerTask/project/{id}

View Activities by Project ID:
  GET /primeapi/restapi/activity/project/{id}

View Project Companies By Code:
  GET /primeapi/restapi/projectCompany/workspace/{workspaceCode}/project/{projectCode}

REQUIRED FIELDS
itemCode - unique id of the task
project - called projectId everywhere else
tasksName - name of the task
type - public/private
workspaceId - will be needed to get the correct project as 'projectId' can be the same for projects on different workspaces.
projectCompanyId - if no tasks exist in a project, create a new projectCompany via API endpoint /primeapi/restapi/projectCompany/. If tasks already exist, get it from one that exists.

RECOMMENDED FIELDS - will work without but should be used
status - e.g. 'PENDING', 'COMPLETED'
userId - assigned user TODO

duration
due date
OPTIONAL FIELDS - depends on usage
activityId - if assigning to an activity
*/

/* TODO:
• Convert xlsx sheets into JSON✓
• Get IDs of workspaces✓
• Get IDs of projects✓
• Get IDs of activities✓
• Format codes
• Format configured fields
• Retrieve any existing tasks✓
• Create new JSON with this data✓


○ For the required field projectCompanyId:
    • Check if a company/project combination already exists in the existing tasks retrieved earlier.
    • If this is the case, retrieve this value from one of the tasks.
    • If it doesn't exist, create it using the company given and the parent project. (and a default colour)
        • Allow user to choose the colour assigned to this relationship
    ♦ NOTE: major improvements made to projectCompany manipulation in API release 18.5; this has now been streamlined and is now unnecessary
*/


/*--------------------IMPORTS--------------------*/
import {xlsxToJson2} from './shared/newJson';
import mapIds from './shared/mapIds';
import {getValue} from './shared/getValue';
import {getProjectId,getActivityId} from './shared/getId';
import * as R from 'ramda';
import mergeDeepAll from './shared/mergeDeepAll';
import * as Promise from 'bluebird';
/*-----------------------------------------------*/
//'data' is the uploaded file
//'this' contains the props from the parent component


async function main(data){

    const fieldMap = (f) => {
        let fieldName = f.name;
        let value = f.value;
        return {textFlexMap:{[fieldName]:value},costFlexMap:{[fieldName]:value},otherFlexMap:{[fieldName]:value}};
    };


    const getProjectCompany = (projectId) => this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/projectCompany/project/${projectId}`});


    const mapProjectCompany = task => {
        let projectId = R.prop('projectId',task);
        let projectCompanies = getProjectCompany(projectId);
        return {projectId:projectId,projectCompanies:projectCompanies};
    };


    const getProjectCompanies = (array) => R.map(mapProjectCompany)(array); //returns array-of-arrays of projectId/projectCompanies


    const getCodeTypes = workspaceArray => R.map(x=>({workspaceCode: x[0],workspaceId:x[1],codeTypes:getCodeTypeByWS(x[1])}))(workspaceArray)


    const getCodeTypeByWS = async (id) => {
        let codeTypes = this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeType/workspace/${await id}`}).then(data=>data.data);

        return codeTypes;
    };

    /*    const tasksJson = xlsxToJson(data,'Tasks');
    const fieldsJson = xlsxToJson(data,'Configured Fields');
    const codesJson = xlsxToJson(data,'Codes');*/
    const tasksJson = await xlsxToJson2(data, 'Tasks'); //processes the excel sheet data into a usable object
    console.log(tasksJson);


    const workspaceCodes = getValue(tasksJson, 'workspaceCode'); //an array of workspace IDs (which are internally known as 'codes')
    const workspaceArray = mapIds.call(this,workspaceCodes); //returns a promise that resolves into a Map object containing workspaceCode/ workspaceId pairs
    let codeTypes = getCodeTypes(workspaceArray);
    let workspaceMap = new Map(workspaceArray);
    console.log(workspaceMap);


    const codeMap = async (c,activity, types) => {
        let codeValue = c.value;
        let codeType = c.type;
        let workspaceCode = activity.workspaceCode;
        let workspace = R.find(R.propEq('workspaceCode',workspaceCode))(types)
        let type = R.find(R.propEq('codeTypeCode',codeType))(await workspace.codeTypes);
        if (type===undefined) {
            dispatchError(`codeType ${codeType} does not exist in workspace ${activity.workspaceCode}`);
            return {};
        }
        let codeTypeId = type.codeTypeId;

        let codeValueId = await this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeValue/code/${codeValue}/codeType/${codeTypeId}`}).then(x=>x.data[0].codeValueId); // contacts the API for the codeValue with code 'codeValue' and codeType with id 'codeTypeId'

        let x = {codeType:{codeTypeId:codeTypeId,},codeValue:{codeValueId:codeValueId, codeTypeId:codeTypeId}}; //this is on object to be returned, formatted to the Prime API format for codes

        return x;

    };

    var dispatchError = error => {
        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error})
        }
    }


    const filterProjects = x => x['projectCode'] && x['workspaceCode']; //the function we are going to pass to R.uniqBy, returning all values whose project ID and workspace ID are unique combinations.

    const filteredProjects = R.uniqBy(filterProjects)(tasksJson); //iterates through tasksJson, returning a new array of unique values (as per the function filterProjects).
    console.log(filteredProjects);


    const projectArray = await Promise.all(R.map(async (x)=>{
        let workspaceId = workspaceMap.get(x['workspaceCode']);
        let projectCode = x['projectCode'];
        let projectId = await getProjectId.call(this,projectCode,await workspaceId);
        if (projectId.id !==undefined){
            return {...x,projectId:projectId.id};
        }
    })(filteredProjects)); // returns a new array of objects with the projectId property added to each object as pId. if the id returned from 'getProjectId' is undefined
    const projectsArray = R.filter(x=>x!==undefined)(projectArray);
    console.log(projectsArray);
    let projectCompanies = getProjectCompanies(projectsArray);
    console.log(projectCompanies);
    //---Get Activity IDs---\\


    const filterActivities = x => x['projectCode'] && x['workspaceCode'] && x['activityCode'];

    const uniqueActivities = R.uniqBy(filterActivities)(tasksJson); //iterates through tasksJson, returning a new array of unique values fulfilling the function filterActivities,
    const filteredActivities = R.filter(x=>x['activityCode'] !== undefined)(uniqueActivities); // filters out any entries in tasksJson that don't have an activity ID (i.e. they are to be unassigned tasks)
    console.log(filteredActivities);


    const activityArray = await R.map(async x=>{
        let project = projectsArray.find(y=>y['projectCode']===x['projectCode']);

        let activityId = await getActivityId.bind(this)(project,x['activityCode']);

        return {...x,activityId:activityId};
    })(filteredActivities); // iterates through filteredActivities, retrieving the activityId for each activity object and adding it as a new activityId property to each object.
    const activitiesArray = await Promise.all(activityArray); //wait for all activityId promises to complete

    console.log(activitiesArray);
    const isValid = task => {
        let workspaceId = task['workspaceCode'];
        let projectId = task['projectCode'];

        //check against workspaceMap:
        let workspaceValid = workspaceMap.get(workspaceId);
        if (workspaceValid === undefined){
            return false;
        }
        //check against projectsArray:

        let projectValid = R.any(R.whereEq({
            'projectCode':projectId,
            'workspaceCode':workspaceId
        }))(projectsArray); //test if any project object contains a project ID/workspace ID match to the current task object
        if (projectValid === false){
            return false;
        }
        //check against activitiesArray:
        if (task.hasOwnProperty('activityCode')){
            let activityId = task['activityCode'];
            let activityValid = R.any(R.whereEq({
                'projectCode':projectId,
                'workspaceCode':workspaceId,
                'activityCode':activityId
            }))(activitiesArray); //test if any project object contains a match to the given schema.
            if (activityValid === false) {
                return false;
            }
        }
        return true;
    }; //function for checking if a task object has valid project, activity, workspace IDs

    const filteredTasks = R.filter(isValid)(tasksJson); //filters out any rows that contain erroneous data (i.e. invalid project, activity and workspace IDs)

    console.log(filteredTasks);
    const mapTasks =async task => {
        console.log(task);
        let projectCode = task['projectCode'];
        let activityCode = task['activityCode'];
        let workspaceCode = task['workspaceCode'];

        let project = R.find(R.whereEq({
            'projectCode':projectCode,
            'workspaceCode':workspaceCode
        }))(projectsArray); //find the object in projectsArray with equal project and workspace IDs.

        let activity = R.find(R.whereEq({
            'projectCode':projectCode,
            'workspaceCode':workspaceCode,
            'activityCode':activityCode
        }))(activitiesArray); //find the object in activitiesArray with equal project, workspace and activity IDs.

        let projectId = project.projectId;

        let pc = await R.prop('projectCompanies')(R.find(R.whereEq({
            projectId:projectId
        }))(projectCompanies));

        let pcData = await pc.data;
        let projectCompany = R.find(R.whereEq({
            companyName:task.company
        }))(pcData);
        let projectCompanyId = R.prop('projectCompanyId')(projectCompany);

        let activityId = R.propOr(null)('activityId')(activity);

        let workspaceId = workspaceMap.get(workspaceCode);

        let newTask = {...task,
            project:projectId,activityId:activityId,
            workspaceId:workspaceId,
            tasksName:task['tasksName'],
            itemCode:task['itemCode'],
            projectCompanyId:projectCompanyId};

        return newTask;

    }; //return a new task object with workspaceId, projectId and activityId properties
    const tasksMapped = R.map(mapTasks)(filteredTasks); //for each task in filteredTasks, find the correct project and activity IDs and add them as properties to this object.
    console.log(tasksMapped);

    const getTasksByProject = x => {
        let projectId = x.projectId;
        let tasks = getTasks.bind(this)(projectId);
        return {projectId:projectId,tasks:tasks};
    }; //gets tasks from a project, returns a key/value par of the projectId to a promise that resolves to an array of tasks.
    const existingTasksMap = R.map(getTasksByProject)(projectsArray);
    console.log(existingTasksMap);


    const checkExists = async task => {
        let t = await task;
        let projectTasksArray = R.find(R.whereEq({
            projectId:t.project
        }))(existingTasksMap); //return the projectId-tasks pair for the projectId of this task.
        let tasks = projectTasksArray;
        console.log(tasks);
        let tasksArray =await tasks.tasks; //wait for the promise of the tasks to return.
        if(!tasksArray){return false;}

        let existingTask = R.find(R.whereEq({
            tasksName:t.tasksName,
            itemCode: t.itemCode
        }))(tasksArray); //returns the task if it already exists
        console.log('existing task:',existingTask);
        return existingTask;
    };
//    const createPC = createPCId.bind(this);
    const removeKeys = (object) => R.omit(['projectCode','workspaceCode','company', 'workspaceId','codes','fields'])(object);


    const processTasks = async t => {
        let task = await t;
        console.log(task);

        let fields = R.prop('fields',task);
        let mappedFields = R.map(fieldMap)(fields);
        let mergedFields = mergeDeepAll(mappedFields);
        console.log(mergedFields);
        let codes = R.prop('codes',task);
        let mappedCodes = R.map(x=>codeMap(x,task,codeTypes))(codes);

        let codeArray =Promise.all(mappedCodes)
        console.log(codeArray);
        let existingTask = await checkExists(task);
        if (existingTask===undefined){
            let processedTask = {...task,codeValues:await codeArray,taskConfiguredFields:mergedFields}
            let strippedData = removeKeys(processedTask);
            let config = {...login, url:'/primeapi/restapi/workManagerTask/', method:'post', data:strippedData};
            console.log(config);
            //getCompanyProjectId.bind(this)(task.Company);
            connection.call('call',config).then(x=>{console.log(x);});
            //console.log(task);
        } else {
            let newTask = R.mergeDeepLeft(task,existingTask);
            console.log(newTask);
            let config = {...login,url:'/primeapi/restapi/workManagerTask/', method:'put',data:newTask};
            connection.call('call',config).then(x=>{console.log(x);});
        }
    };
    const connection = this.store.asteroid;
    const login = this.store.loginDetails;


    R.forEach(processTasks)(tasksMapped);

}



/* ---Retrieve all tasks in a given project---

View Tasks by Project ID:
  GET /primeapi/restapi/workManagerTask/project/{id}*/
function getTasks(projectId){
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;
    let url = `/primeapi/restapi/workManagerTask/project/${projectId}`;
    let config = {...login,url:url};
    let tasks = connection.call('call',config).then(x=>{if(x.data){return x.data;}else{return [];
    }});
    return tasks;
}

/* ---PROJECT COMPANY---
Tasks require the field 'projectCompanyId' to be created. This is a relation between a colour and a company for a certain project, being used in gantt charts for visual differentiation.

This object, projectCompany, needs to either be created if a relation doesnt already exist or obtained from an existing task. Because this value doesn't indicate which company it relates to, it will be easiest to retrieve this after being merged with the existing project. NOTE: this is not the most efficient method in terms of API requests, but i don't expect a noticeable performance impact.

The excel template has a column for the company this task is to be assigned to.
• Send a GET request for the following API Endpoint:
  /primeapi/restapi/company/name/{name}
  ○ the companyId can be obtained from the object returned from this request.✓

• If a project has existing tasks, get all unique projectCompanyId values.✓
  ○ For each projectCompanyId, view its data by sending a GET request to the following endpoint:
    /primeapi/restapi/projectCompany/{id}
  ○ find if any of these objects have a matching companyId property to the one of the tasks.
*/

/*returns a list of unique company names from the given json*/
function getCompanyNames(tasks){
    const companyList = R.map(R.prop('Company'))(tasks);
    const uniqueList = R.uniq(companyList);
    console.log('unique company list: ',uniqueList);
    return uniqueList;
}
/*returns the companyId of the given company name*/
function getCompanyId(companyName) {
    let connection = this.store.asteroid;
    let login = this.store.loginDetails;
    let url = `/primeapi/restapi/company/name/${companyName}`;
    let config = {...login,url:url,method:'get'};

    let companyId = connection.call('call',config).then(x=>{
        return x.data[0].companyId;
    });
    return {companyName:companyName,companyId:companyId};
}
/*returns an array of key/value pairs of companyName/companyId from a given list of company names*/
function mapCompanyIds(nameList) {
    let getId = getCompanyId.bind(this);
    let map = R.map(getId)(nameList);

    return map;
}

/*---Returns a list of unique projectCompanyIds for a given project*/
async function getProjectCompanyIds(taskList) {
    let ids = R.map(R.prop('projectCompanyId'))(await taskList);
    let uniqIds = R.uniq(ids);
    return uniqIds;
}
/*returns an array of key/value pairs of projectId to an array of unique projectCompanyIds for that project*/
function mapPCIdsToProject(existingTasksMap){
    let f = (object) => {
        let projectId = object.projectId;
        let tasks = object.tasks; //currently in promise form
        let uniqIds = getProjectCompanyIds(tasks);
        return {projectId:projectId,uniqIds:uniqIds};
    };
    return R.map(f)(existingTasksMap);
}

/*return the companyId a projectCompany from a given projectCompanyId*/
function getProjectCompanyId(id) {
    const connection = this.store.asteroid;
    const login = this.store.loginDetails;
    const config = {...login,url:`/primeapi/restapi/projectCompany/${id}`,method:'get'};
    let projectCompany = connection.call('call',config).then(x=>x.data.companyId);

    return projectCompany;
}


/*accepts a projectId and companyId
sends a POST request to the endpoint /primeapi/restapi/projectCompany/
returns the created PCId*/
async function createPCId(projectId,companyId){
    //let companyId = await company;
    console.log(projectId,companyId);
    const connection = this.store.asteroid;
    const login = this.store.login;
    const url = '/primeapi/restapi/projectCompany/';
    let data = {projectId:projectId,companyId:await companyId,color:'0000ff'};
    let id = connection.call('call',{...login,url:url,data:data, method:'post'}).then(x=>x.data.projectCompanyId);
    return id;
}



export default main;
