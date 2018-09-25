import { xlsxToJson } from './processInput';
import {getValue} from './getValue';
import union from 'lodash/union';

//converts the xlsx file into seperate json objects
export default function workspaces(data) {
    //converts the data from the excel template file into json
    var projectsJson = xlsxToJson(data, 'Projects');
    var codesJson = xlsxToJson(data, 'Codes');
    var fieldsJson = xlsxToJson(data, 'Configured Fields');
    //get all the unique workspace names froms all of the sheets.
    var codes = getValue(codesJson,'workspaceId');
    var projects = getValue(projectsJson,'workspaceId');
    var fields = getValue(fieldsJson,'workspaceId');
    //combine all unique workspace names into one array.
    var workspaceNames = union(codes, projects, fields);
    return workspaceNames
}
