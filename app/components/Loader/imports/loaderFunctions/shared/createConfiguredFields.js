import React from 'react';
import mapIds from './mapIds';
import {xlsxToJson} from './processInput';
import {transform} from 'lodash';
import {getValue} from './getValue';
// NOTE: configured fields require the following values to be created: column name, label, workspaceId, dataType.

// NOTE: The API url requires the 'objectType' parameter, which accepts the following values:"PROJECT", "ACTIVITY", "RISK", "ASSIGNMENT", "WBS", "WORK_PACKAGE", "SCOPE_ITEM", "SCOPE_ITEM_ASSIGNMENT", "COMPANY", "CAPITAL_PLAN", "PROJECT_ACTUALS", "DOCUMENT", "WORKSPACE_COST_SHEET", "PROJECT_COST_SHEET", "BUDGET_ITEM", "BUDGET_CHANGE", "BUDGET_TRANSFER", "BUDGET_TRANSACTION", "CHANGE_ORDER", "WORK_MANAGER_TASK"

// NOTE: this function will be called from inside 'loaderContainer' class instances, the definition of which can be found in 'Loaders.js'. loaderContainer is defined with two variables: id and title. Id can be used for designating what sort of configured field is being created if objectType is needed, referenced as 'this.props.id'.

//the following works to create a configured field
const testField = {
    'columnName': 'test',
    label: 'testlabel',
    'workspaceId': 16001,
    'dataType': 'FT_TEXT'
};
const info = {
    baseURL: 'https://rpcuk-prime-eu.oracleindustry.com',
    url: '/primeapi/restapi/field?objectType=PROJECT',
    auth: {
        'username': 'james.bentley@rpc.uk.com',
        'password': '8Cv$V/3V'
    },
    method: 'post',
    data: testField
};

async function createConfiguredFields(data) {
    //the context of 'this' is the same as the <DataLoader/> component that calls this function, containting its properties: id, store and dispatch (and this function).

    //converts the xlsx file uploaded into a json format.
    let json = xlsxToJson(data, 'Configured Fields');

    //to maintain the same value of 'this', functions must access their .call() prototype function with the value of 'this' desired to be used.
    const idMap = await makeMap.call(this, json);
    const formattedData = await formatData.call(this, json, idMap);
    let objectType = this.id;
    const connection = this.store.asteroid;
    const login = {
        ...this.store.loginDetails,
        url: '/primeapi/restapi/field?objectType=' + objectType,
        method: 'post'
    };
    //sends a POST request to the API endpoint in 'login' for each object in 'formattedData'. If the request fails, dispatch an error message to the screen.
    const loop = (x, i) => {
        if (x.success === false) {
            let getWorkspaceName = (idMap) => {
                for (let x of idMap) {
                    if (x[1] === i.workspaceId) {
                        return x[0];
                    }
                }
            };

            let workspaceName = getWorkspaceName(idMap);

            this.dispatch({
                type: 'SEND_EXCEPTIONS',
                data: 'Code Value Name ' + i.columnName + ' already exists in workspace ' + workspaceName + '. Please enter a unique value.'
            });
        }
    };
    for (var i of formattedData) {

        let config = {
            ...login,
            data: i
        };
        connection.call('call', config).then(loop);
    }

}
//re-keys the data in the json given to the correct key names, plus setting the workspaceId value to the internal value that is stored in 'idMap'.
async function formatData(json, idMap) {

    const formattedData = transform(json, (acc, n) => {

        let field = {
            columnName: n['View Column Name'],
            label: n['Column Label'],
            dataType: n['Data Type'],
            workspaceId: idMap.get(n['workspaceId'])
        };
        acc.push(field);
    });
    return formattedData;
}

async function makeMap(json) {
    //a unique list of workspace names
    const workspaceNames = getValue(json, 'workspaceId');
    //an array of key/value pairs of workspaceName/workspaceId which is then converted to a Map object.
    const idMap = await mapIds.call(this, workspaceNames).then((x) => new Map(x));
    return idMap;
}

export default createConfiguredFields;
