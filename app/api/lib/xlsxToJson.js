/* a new take on importing excel loader template files to make the file easier to use */
/* global require */
import defaultFields from './defaultFields';

const Excel = require('xlsx-populate/browser/xlsx-populate');
const R = require('ramda');
const moment = require('moment');

/*-----------------------------------------*/

const getCellValues = cells => R.map(R.prop('_value'))(cells._cells);

const formatDate = date => moment(date).format('YYYY-MM-DDT00:00:00');

const parseValue = cell => {
  const format = cell.style('numberFormat');
  const value = cell.value();

  if (R.contains('yy', format)) {
    const date = Excel.numberToDate(value);
    return formatDate(date);
  }
  return String(value);
};

function createSheet(sheet, headers) {
  function handleRow(row) {
    return R.reduce(handleCell)({ codes: [], fields: [] })(
      R.reject(R.equals(undefined))(row._cells)
    );
  }

  function handleCell(acc, cell) {
    const pos = cell.columnNumber();
    const [type, name] = headers[pos];
    const value = parseValue(cell);
    switch (type) {
      case 'Configured Field':
        acc.fields.push({ name, value });
        return acc;
      case 'Code':
        acc.codes.push({ type: name, value });
        return acc;
      default:
        acc[defaultFields.get(name) || name] = value;
        return acc;
    }
  }
  const rows = R.drop(3)(sheet._rows);
  const json = R.map(handleRow)(rows);
  return json;
}
export default async function xlsxToJson(file) {
  const workbook = await Excel.fromDataAsync(file);
  const sheet = workbook.sheet(0);

  const row1 = getCellValues(sheet.row(1));
  const row2 = getCellValues(sheet.row(2));
  const headers = R.zip(row1, row2);
  const json = createSheet(sheet, headers);

  return json;
}
