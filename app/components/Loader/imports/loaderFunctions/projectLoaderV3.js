import {xlsxToJson2 } from './shared/newJson';
import * as he from 'he';
import * as R from 'ramda';
import * as Promise from 'bluebird';
import mergeDeepAll from './shared/mergeDeepAll';

/*------------------------------------------------*/

export default async function main(data) {

    const dispatchError = error => {
        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error});
        }
    }; //checks if the error is already displayed, if it isn't then dispatch the error.

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

    const getWorkspaces = projects => {
        let uniq = R.uniqBy(R.prop('workspaceCode'))(projects); //return list of unique workspaces
        return R.map(x=>{
            let workspace = R.prop('workspaceCode',x);
            return [workspace,getWorkspaceId(workspace)];})(uniq); //returns an array of workspaceCode/Id pairs
    };

    const getCodeTypeByWS = async (id) => {
        let codeTypes = this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeType/workspace/${await id}`}).then(data=>data.data);

        return codeTypes;
    };

    const getProjectsByWS = async id => {
        return this.store.asteroid.call('call',{...this.store.loginDetails,url:`primeapi/restapi/project/workspace/${await id}`}).then(x=>x.data);
    };

    const codeMap = async (c,project, types) => {
        let codeValue = c.value;
        let codeType = c.type;

        let type = R.find(R.propEq('codeTypeCode',codeType))(await types);
        if (type===undefined) {
            dispatchError(`codeType ${codeType} does not exist in workspace ${project.workspaceId}`);
            return {};
        }
        let codeTypeId = type.codeTypeId;

        let codeValueId = await this.store.asteroid.call('call',{...this.store.loginDetails,url:`/primeapi/restapi/codeValue/code/${codeValue}/codeType/${codeTypeId}`})
            .then(x=>x.data[0].codeValueId);
        let x = {codeType:{codeTypeId:codeTypeId,},codeValue:{codeValueId:codeValueId, codeTypeId:codeTypeId}};

        return x;
    };

    const fieldMap = (f) => {
        let fieldName = f.name;
        let value = f.value;
        return {textFlexMap:{[fieldName]:value},costFlexMap:{[fieldName]:value},otherFlexMap:{[fieldName]:value}};
    };

    const getExistingProject = async (projectCode,workspaceId) => {

        return getProjectsByWS( workspaceId).then(projects=>R.find(R.propEq('projectCode',projectCode))(projects));
    };

    const projectMap =async project => {


        let workspaceId = workspaces.get(project.workspaceCode);
        let projectCode = he.decode(project.projectCode);
        let existingProject = getExistingProject(projectCode,workspaceId);
        let types = getCodeTypeByWS(workspaceId);
        //let fieldsData = getFieldsByWS(workspaceId);
        let codes = Promise.all(R.values(R.map(x=>codeMap(x,project,types))(project.codes)));

        let fields = R.prop('fields',project);

        let mappedFields = R.map(fieldMap)(fields);
        let mergedFields = mappedFields.length >0? mergeDeepAll(mappedFields) : {}


        let oldProject = R.omit(['codes','fields','financial','workspaceCode'])({...project,workspaceId:workspaceId,projectCode:project.projectCode, codeValuesProject:codes,projectConfiguredFields:mergedFields});

        const mergeProjects = async (oldProject,existingProject) =>{

            return R.mergeDeepRight( await existingProject || {})(oldProject);};

        let newProject = mergeProjects(oldProject,existingProject);

        return newProject;
    };

    const submitProject = async (proj) =>{
        console.log(proj);
        Promise.props(proj).then(p=>{
            console.log(p);

            return this.store.asteroid.call('call',{...this.store.loginDetails,data:p,method: p.projectId?'put':'post',url:'primeapi/restapi/project'}).then(x=>{console.log(x.data);
            });
        });
    };

    const projectsJson = await xlsxToJson2(data, 'Projects'); //returns a json-formatted version of the input excel file with sheet named 'Projects'
    let workspaces = new Map(getWorkspaces(projectsJson)); //maps workspaceCodes to WorkspaceIds
    let newJson = R.map(projectMap)(projectsJson);

    let submit = Promise.all(newJson).then(projects => {return R.map(submitProject)(projects);});
    return await submit;
}
