/* uses lodash's find function to either return a value if it exists or return undefined if it doesn't */
import * as _ from 'lodash'

export function codeInWorkspace(json, map) {
    var workspace = json.workspaceId;
    var codeTypes = map.get(workspace)
    //find and return the codeType object whose code(user-defined id) matches the id in the json passed above
    var checkExists = _.find(codeTypes, function(object) {
        return object.codeTypeCode === json.codeTypeId;
    });
    //checks if the given codeType exists in the selected workspace, returns an error message if not
    return checkExists;
}
export function fieldInWorkspace(json,map) {
    var workspace = json.workspaceId;

    var fields = map.get(workspace);
    var checkExists = _.find(fields,(value) => {
        return value.viewColumnName === json['field column name'];
    });
    if (checkExists){
        return checkExists;}
    else {
        return null;}
}

export function projectInProjectsArray(json={}, projects) {

    var workspace = json.workspaceId;
    var checkExists = _.find(projects.get(workspace), (value) => {
        return value.projectCode == json.projectId;
    });

    return checkExists;
}

export function projectInProjectsJson(json, projectsJson) {
    var checkExists = _.find(projectsJson, (value) => {
        return (value.projectId == json.projectId && value.workspaceId == json.workspaceId);

    });

    return checkExists;
}
