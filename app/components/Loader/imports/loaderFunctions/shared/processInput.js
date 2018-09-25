import * as XLSX from 'xlsx';

export function xlsxToJson(file, sheetName) {

    var input = XLSX.read(file, {type:'buffer'});

    var sheet = input.Sheets[sheetName];
    var json = XLSX.utils.sheet_to_json(sheet);
    
    return json;
}
