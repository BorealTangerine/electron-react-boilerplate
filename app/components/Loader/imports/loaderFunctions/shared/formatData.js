

import * as _ from 'lodash';

import * as viewData from './viewData';
import * as CheckExists from './checkExists';
/* ------------------------------------- */
//for each workspace with codes assigned to it in the template, add a list of all the codeTypes to it.
export async function retrieveCodeData(codes, map) {

    let newMap = map.map(async (value) => {
        var key = value[0];
        var id = value[1];
        //var codeTypes = viewCodeTypes(id);
        var codeTypes = await viewData.byWorkspaceId.call(this,id, 'primeapi/restapi/codeType/workspace/');
        return [key, codeTypes];
    });

    return Promise.all(newMap);
}
export function retrieveCodeValues(codesJson) {

    let newJson = codesJson.map(async (json) => {
        let codeTypeId = json.codeTypeId;
        let codeValueCode = json.codeValueId;
        let connection = this.store.asteroid;
        let newLogin = { ...this.store.loginDetails, url: '/primeapi/restapi/codeValue/code/' + codeValueCode + '/codeType/' + codeTypeId };
        let codeValueData = await connection.call('call', newLogin);
        return { ...json, codeValueId: codeValueData.data[0].codeValueId };
    });
    return Promise.all(newJson);
}
//for each workspace with fields assigned to it in the template, add a list of all the fields to it.
export function retrieveFields(fieldsWorkspaces, map) {

    let newMap = map.map(async (value) => {
        var key = value[0];
        var id = value[1];
        var fields = await viewData.byWorkspaceId.call(this,id, 'primeapi/restapi/field/workspace/');
        return [key, fields];
    });
    return Promise.all(newMap);
}
export function formatCodeType(codesJson, codes) {
    //add a new property to every object in projectsJson that is used to contain all codeValues.

    var newJson = _.transform(codesJson, (acc, json) => {

        //check if the codeType exists in the given workspace
        var inWorkspace = CheckExists.codeInWorkspace(json, codes);

        //if the codeType doesn't exist in the workspace, give an error and move onto the next object
        if (!inWorkspace) {
            this.dispatch({ type: 'SEND_EXCEPTIONS', data: 'code type ' + json.codeTypeId + ' does not exist in workspace ' + json.workspaceId });
            //if the codeType does exist in the workspace, continue);
        } else if (inWorkspace) {
            acc.push({ ...json, codeTypeId: inWorkspace.codeTypeId });
        }
    });
    return newJson.filter(name => name !== undefined);
}
export function formatFieldsData(fieldsJson, fields) {
    var newJson = _.transform(fieldsJson, (acc, json) => {
        var inWorkspace = CheckExists.fieldInWorkspace(json, fields);
        if (!inWorkspace) { this.dispatch({ type: 'SEND_EXCEPTIONS', data: 'configured field ' + json['field column name'] + ' does not exist in workspace ' + json.workspaceId }); } else if (inWorkspace) {
            acc.push(addToFlexMap(json, inWorkspace));
        }
    });
    return newJson.filter(name => name !== undefined);
}
//container is the main json e.g. projectsJson to add to. data is the user data to be added. object is the field's information.
function addToFlexMap(json, fieldData) {
    let dataType = fieldData.dataType;
    if (dataType == 'FT_TEXT') {
        return { ...json, projectConfiguredFields: { textFlexMap: {
            [fieldData.viewColumnName]: json['field data'] } } };
    } else if (dataType == 'FT_MONEY') {
        return { ...json, projectConfiguredFields: { costFlexMap: {
            [fieldData.viewColumnName]: json['field data'] } } };
    } else {
        return { ...json, projectConfiguredFields: { otherFlexMap: {
            [fieldData.viewColumnName]: json['field data'] } } };
    }
}
