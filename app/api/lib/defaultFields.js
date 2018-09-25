/* An array of arrays acting as key-value pairs for user-friendly spreadsheet column headers to be exchanged for internally used property names. This exchange is only performed on 'Standard' column headings */

const defaultFields = [
  ['Project ID', 'code'],
  ['Project Name', 'name'],
  ['Activity ID', 'code'],
  ['Activity Name', 'name'],
  ['Task Name', 'name'],
  ['Task ID', 'code'],
  ['Workspace ID', 'workspace'],
  ['Start Date', 'startDate'],
  ['Finish Date', 'finishDate'],
  ['Company', 'company']
];

export default new Map(defaultFields);
