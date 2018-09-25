/*a new take on importing excel loader template files to make the file easier to use*/
/*global require*/
import defaultFields from './defaultFields';
const Excel = require('xlsx-populate/browser/xlsx-populate');
const R = require('ramda');
const moment = require('moment');

/*-----------------------------------------*/


const getCellValues = cells => R.map(R.prop('_value'))(cells._cells);

export async function xlsxToJson2(file){
    // const workbook = xlsx.read(file, {cellStyles:true, type:'buffer'});
    // const sheet = workbook.Sheets[sheetName];
    //
    // const getHeadings = sheet => {
    //     headings = [];
    //     const getHead = (value,cell) => {
    //
    //     }
    let formatDate = (date) => moment(date).format('YYYY-MM-DDT00:00:00');

    let parseValue = (cell) => {
        let format = cell.style('numberFormat');
        let value = cell._value;

        if (R.contains('yy',format)){
            let date = Excel.numberToDate(value);

            return formatDate(date);
        } else {
            return value;
        }
    };
    let workbook = await Excel.fromDataAsync(file);

    let sheet = workbook.sheet(0);
    let row1 = getCellValues(sheet.row(1));
    let row2 = getCellValues(sheet.row(2));
    let headers =R.zip(row1,row2);
    const makeSheet = (sheet,headers) => {

        let json = [];
        let rows = R.drop(3,sheet._rows);
        for (let i of rows){
            let o = {codes:[],fields:[]};

            for (let cell of R.reject(R.equals(undefined),i._cells)) {


                let pos = cell._columnNumber;
                let [type,name] = headers[pos];
                let value = parseValue(cell);

                switch (type) {
                    case 'Configured Field':
                        o['fields'].push({name:name,value:value});
                        break;
                    case 'Code':
                        o['codes'].push({type:name,value:value});
                        break;
                    default:
                        o[defaultFields.get(name) || name]=value;

                }
            }
            json.push(o);
        }
        return json;
    };
    let json = makeSheet(sheet,headers);
    return json;
}
