import * as he from 'he';
import * as R from 'ramda';
//import * as Promise from 'bluebird';
import * as Excel from 'xlsx-populate/browser/xlsx-populate';
import * as rest from './restCalls';
const decode = v => R.type(v)==='String' ? he.decode(v) : v;
const decodeObject = o => R.map(decode)(o);
const decodeObjectArray = a => R.map(decodeObject)(a);


const processInput = async data => {
    const workbook = await Excel.fromDataAsync(data);
    const ws = workbook.sheet('Codes'); //set worksheet to the 'Codes' worksheet.
    const range = ws.usedRange(); //range of cells used in the sheet
    const rowCount = range._numRows; //number of rows in the sheet

    let codeMap = []; //initialize array

    for (var i = 2; i <= rowCount; i++) {
        //starts at second row (first is headers), iterates through each row

        let row = ws.row(i);
        let workspaceCode = row.cell(1).value();
        let codeTypeName = row.cell(2).value();
        let codeTypeCode = row.cell(3).value();
        let codeValueName= row.cell(4).value();
        let codeValueCode = row.cell(5).value();
        let codeValueParent = row.cell(6).value();
        let cv = {name:codeValueName,code:codeValueCode,parent:codeValueParent};
        let existing = R.findIndex(R.whereEq({
            workspaceCode:workspaceCode,
            codeTypeCode:codeTypeCode
        }))(codeMap);
        //if this codeType isn't in the codeMap array already and the following values exist
        if (existing === -1 && codeTypeCode && codeTypeName && workspaceCode){
            let code = {
                codeTypeCode:codeTypeCode,
                codeTypeName:codeTypeName,
                workspaceCode:workspaceCode,
                codeValues:[]
            };
            //if there's a codeValue on the same row as the codeType
            if (codeValueName && codeValueCode) {
                code.codeValues.push(cv);
            }
            codeMap.push(code); //append this codeType to codeMap

            //if the row has no codeType, but does have a codeValue
        } else if(!codeTypeCode && codeValueName && codeValueCode){
            let object = codeMap[codeMap.length-1]; //get the last codeType in codeMap
            object.codeValues.push(cv); //add the codeValue to this codeType
        }
    }
    return codeMap;
};

const getUniqueWorkspaces = json => R.uniq(R.map(R.prop('workspaceCode'))(json));

const checkExisting = R.curry((codeTypes, codeValues, code) => {
    let workspaceCode = R.prop('workspaceCode')(code);
    let codeTypeCode = R.prop('codeTypeCode')(code);
    let newValues = R.prop('codeValues')(code);
    let findByWorkspaceCode = R.find(R.whereEq({workspaceCode:workspaceCode}));
    let existingCodeValues = R.prop('codeValues')(findByWorkspaceCode(codeValues));

    let existingCodeTypes = R.prop('codeTypes')(findByWorkspaceCode(codeTypes));
    let codeType = findExistingCodeType(existingCodeTypes,codeTypeCode);

    let codeValueArray = findExistingCodeValueArray(codeType,existingCodeValues); //find the array of codeValues
    //console.log('cva', await codeValueArray);
    let filteredCodeValues = filterCodeValues(codeValueArray,newValues);

    return {...code,codeValues:filteredCodeValues};

});

const filterCodeValues = async (existingValues,newValues) => {
    let existing = await existingValues;
    if (existing){
        let findExisting = findExistingCodeValue(existing);
        let filtered =  R.reject(findExisting)(newValues);

        return filtered;
    } else {
        return newValues;
    }

    // console.log(existing);
    // return newValues
};

const filterExistingCodes = (data,existingCodeTypes,existingCodeValues) => {
    return R.map(checkExisting(existingCodeTypes,existingCodeValues))(data);
};


const findExistingCodeValueArray = async (codeType,codes) =>{
    let array =  R.find(R.whereEq({codeTypeId:R.prop('codeTypeId')(await codeType)}))(await codes);
    return R.prop('codeValues')(array);
};


const findExistingCodeType = async (codeTypes, codeTypeCode)=> {
    let codeTypeArray = R.prop('data')(await codeTypes);
    // let array = decodeObjectArray(codeTypeArray);
    let codeType = R.find(R.whereEq({codeTypeCode:codeTypeCode}))(codeTypeArray);
    return codeType;
};

const findExistingCodeValue = R.curry((existing,codeValue) =>{
    // let existing = decodeObjectArray(existingValues);
    let f = R.propEq('codeValueCode')(R.prop('code')(codeValue));
    let find =  R.find(f)(existing);
    return find ? true:false;
});



export default async function main(data){

    const get = rest.get.bind(this);
    const post = rest.post.bind(this);
    const put = rest.put.bind(this);


    const dispatchError = error => {
        if (!R.find(R.match(error))(this.store.exceptions)){
            this.dispatch({type:'SEND_EXCEPTIONS',data:error});
        }
    };

    //gets a workspaceId from a given workspaceCode.
    const getWorkspaceId = name => ( get(`primeapi/restapi/workspace/code/${name}`).then(r => {

        switch (r.success) {
            //if success, return the workspaceID (it always returns in an array, I haven't ever seen it with more than one item)
            case true:

                return  r.data[0].workspaceId;
                //if false then the request failed, sending an error message back

            default:
                this.dispatch({type:'SEND_EXCEPTIONS',data:`workspace ${name} doesn't exist`});
                return undefined;
        }
    })
    );

    const getCodeTypes = workspaceId => get(`/primeapi/restapi/codeType/workspace/${workspaceId}`);

    const mapCodeTypes = ([code,id]) => {
        return {
            workspaceId:id,
            workspaceCode:code,
            codeTypes:getCodeTypes(id)
        };
    };

    const mapWorkspaces = workspaces => R.map(x=>Promise.all([x,getWorkspaceId(x)]))(workspaces);

    const createCodeType = (code) => {
        let codeTypeCode = code.codeTypeCode;
        let codeTypeName = code.codeTypeName;
        let workspaceId = workspaceMap.get(code.workspaceCode);
        let codeType = {
            codeTypeCode:codeTypeCode,
            codeTypeName:codeTypeName,
            workspace:workspaceId};

        let create = post('primeapi/restapi/codeType',codeType).then(r=>{
            if (r.success === false){
                //dispatchError(`Workspace ${code.workspaceCode}:  ${r.data}`);
                return getCodeTypes(workspaceId).then(x=>{
                    let codeType = R.find(R.whereEq({codeTypeCode:codeTypeCode,codeTypeName:codeTypeName}))(x.data);
                    return {...codeType,codeValues:code.codeValues};
                },()=>dispatchError(`cannot create code ${codeTypeCode} in ${code.workspaceCode}`));
            } else {
                return {...r.data,codeValues:code.codeValues};
            }
        });
        return create;
    };

    const handleCodeValues = async code => {

        const values = await R.prop('codeValues',code);
        let codeTypeId = R.prop('codeTypeId',code);
        const codeValues = await Promise.all(R.map(mapCodeValue(codeTypeId),values));
        const children = R.filter(R.prop('parent'))(values);
        let updatedCodeValues = R.map(mapCodeValueParent(codeValues))(children);
        return updatedCodeValues;

    };
    const viewCodeValues = codeTypeId => get(`/primeapi/restapi/codeValue/codeType/${codeTypeId}`).then(response=>response.data);

    const getExistingCodeValues = codeType =>{
        let codeTypeId = R.prop('codeTypeId')(codeType);
        return {
            codeTypeId: codeTypeId,
            codeValues:viewCodeValues(codeTypeId)
        };
    };

    const mapExistingCodeValues = async codeTypes => R.map(getExistingCodeValues)(R.prop('data')(await codeTypes));

    const mapCodeValues = workspace =>{
        let codeTypes = R.prop('codeTypes')(workspace);
        return {
            workspaceId:R.prop('workspaceId')(workspace),
            workspaceCode:R.prop('workspaceCode')(workspace),
            codeValues:mapExistingCodeValues(codeTypes)
        };
    };

    const mapCodeValue = R.curry((codeTypeId,value) => {

        let codeValueName = R.prop('name',value);
        let codeValueCode = R.prop('code',value);
        let codeValue = {
            codeValueName:codeValueName,
            codeValueCode:codeValueCode,
            codeTypeId:codeTypeId
        };
        return createCodeValue(codeValue);

    });

    const createCodeValue = codeValue => {
        return post('primeapi/restapi/codeValue',codeValue)
            .then(x=>x.data);
    };

    const updateCodeValue = codeValue => {
        return put('primeapi/restapi/codeValue',codeValue);
    };

    const mapCodeValueParent = R.curry((codeValues,child)=>{
        let parentCodeValueCode = R.prop('parent',child);

        let parentCodeValue = R.find(R.propEq('codeValueCode',parentCodeValueCode))(codeValues); // returns the codeValue with a codeValueCode matching that of the child's parent codeValueCode.

        if(parentCodeValue){
            let parentCodeValueId = parentCodeValue.codeValueId;
            let childCodeValueCode = R.prop('code',child);
            let childCodeValue = R.find(R.propEq('codeValueCode',childCodeValueCode))(codeValues);
            let updatedCodeValue = {...childCodeValue,parentCodeValue:parentCodeValueId};
            return updateCodeValue(updatedCodeValue);
        }
    });

    let json = await processInput(data);
    let workspaces = getUniqueWorkspaces(json);
    let workspacePairs = await Promise.all(mapWorkspaces(workspaces)); //key value pairs of workpaceCode to workspaceId
    let workspaceMap = new Map(workspacePairs); //map object to use get/set
    let existingCodeTypes = R.map(mapCodeTypes)(workspacePairs); //codeTypes that already exist in case they need to be updated
    let existingCodeValues = R.map(mapCodeValues)(existingCodeTypes); //the codeValues for each of the existing CodeTypes

    let filteredData = filterExistingCodes(json,existingCodeTypes,existingCodeValues); // a copy of json with any existing codeValues removed

    let createCodeTypes =R.map(createCodeType)(filteredData);
    console.log(createCodeTypes);
    let codeTypes = await Promise.all(createCodeTypes);
    console.log(codeTypes);
    let codeValues = R.map(handleCodeValues,R.filter(x=>x!==undefined,codeTypes));
    return await Promise.all(codeValues);
}
