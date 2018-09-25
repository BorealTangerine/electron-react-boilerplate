/* An array of arrays acting as key-value pairs for user-friendly spreadsheet column headers to be exchanged for internally used property names. This exchange is only performed on 'Standard' column headings */

const defaultFields = [
    ['Project ID','projectCode'],
    ['Project Name','projectName'],
    ['Activity ID','activityCode'],
    ['Activity Name','activityName'],
    ['Task Name','tasksName'],
    ['Task ID','itemCode'],
    ['Workspace ID','workspaceCode'],
    ['Start Date','startDate'],
    ['Finish Date','finishDate'],
    ['Company','company']

];



export default new Map(defaultFields);
