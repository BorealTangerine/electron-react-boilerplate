import {curry, differenceWith} from 'ramda';
let data = [
  {

    'workspace': 'DEV',
    'code': '15',
    'name': '4G Tablet Project',
    'startDate': '2016-04-01T00:00:00',
    'finishDate': '2016-04-01T00:00:00'
  },
  {

    'workspace': 'DEV',
    'code': '4G',
    'name': '4G Tablet Project',
    'startDate': '2016-04-01T00:00:00',
    'finishDate': '2016-04-01T00:00:00'
  }

];
let existing = [
  {
    'parentProject': 4,
    'projectCode': '4G',
    'securityGuid': '6E88073F8A797719E05368D7650A3C12',
    'projectCurrency': 0,
    'exchangeRateType': 'PEGGED',
    'isTemplateFlag': false,
    'percentCompleteWeightedBy': 'QUANTITY',
    'recordCount': 1,
    'finishDate': '2016-04-01T00:00:00.+0000',
    'projectAutoNumber': [
      {
        'projectAutoNumberId': 73600,
        'area': 'WBS',
        'increment': 10,
        'suffix': '1',
        'prefix': 'WBS',
        'updateDate': '2018-08-18T08:42:19'
      },
      {
        'projectAutoNumberId': 30401,
        'area': 'ACTIVITY',
        'increment': 10,
        'suffix': '1000',
        'prefix': 'A',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30402,
        'area': 'WORK_MANAGER_TASK',
        'increment': 1,
        'suffix': '1',
        'prefix': 'TS',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30403,
        'area': 'BUDGET_CHANGE',
        'increment': 1,
        'suffix': '10',
        'prefix': 'BC',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30404,
        'area': 'SCOPE_ASSIGNMENT',
        'increment': 1,
        'suffix': '10',
        'prefix': 'SA',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30405,
        'area': 'IDEA',
        'increment': 1,
        'suffix': '001',
        'prefix': 'IDEA',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30406,
        'area': 'ACTUALS',
        'increment': 1,
        'suffix': '001',
        'prefix': 'ACT',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30407,
        'area': 'SCOPE_ITEM',
        'increment': 1,
        'suffix': '10',
        'prefix': 'SI',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30408,
        'area': 'RISK',
        'increment': 1,
        'suffix': '1',
        'prefix': 'R',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30409,
        'area': 'CHANGE_ITEM',
        'increment': 1,
        'suffix': '10',
        'prefix': 'CI',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30410,
        'area': 'SUBMITTAL',
        'increment': 1,
        'suffix': '00001',
        'prefix': 'SUB',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30411,
        'area': 'POTENTIAL_CHANGE_ORDER',
        'increment': 1,
        'suffix': '001',
        'prefix': 'PCO',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30412,
        'area': 'CHANGE_REQUEST',
        'increment': 1,
        'suffix': '10',
        'prefix': 'CR',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30413,
        'area': 'ACTIVITY_ASSIGNMENT',
        'increment': 1,
        'suffix': '0',
        'prefix': 'AA',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30414,
        'area': 'RFI',
        'increment': 1,
        'suffix': '00001',
        'prefix': 'RFI',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30415,
        'area': 'COMMITMENT',
        'increment': 1,
        'suffix': '001',
        'prefix': 'CMT',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30416,
        'area': 'CONTRACT',
        'increment': 1,
        'suffix': '001',
        'prefix': 'CON',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30417,
        'area': 'CHANGE_EVENT',
        'increment': 1,
        'suffix': '001',
        'prefix': 'CME',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30418,
        'area': 'CHANGE_ORDER',
        'increment': 1,
        'suffix': '001',
        'prefix': 'CO',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30419,
        'area': 'WORK_PACKAGE',
        'increment': 1,
        'suffix': '10',
        'prefix': 'WP',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30420,
        'area': 'BUDGET_TRANSFER',
        'increment': 1,
        'suffix': '10',
        'prefix': 'BT',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30421,
        'area': 'PAYMENT_APPLICATION',
        'increment': 1,
        'suffix': '001',
        'prefix': 'PA',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 30422,
        'area': 'CUSTOM_LOGS_ITEM',
        'increment': 1,
        'suffix': '0001',
        'prefix': 'CL',
        'updateDate': '2018-06-13T14:45:05'
      },
      {
        'projectAutoNumberId': 90600,
        'area': 'RESOURCE',
        'increment': 1,
        'suffix': '1',
        'prefix': 'R',
        'updateDate': '2018-08-18T08:42:20'
      }
    ],
    'strgyPriorityNum': 500,
    'codeValuesProject': [
      {
        'codeValue': {
          'codeTypeName': 'Strategic Objective',
          'codeValueId': 8411,
          'parentCodeValue': 0,
          'codeValueName': 'Customer Retention',
          'codeValueCode': 'CR',
          'codeTypeId': 10103,
          'sequenceNumber': 0,
          'updateDate': '2018-06-13T12:22:18'
        },
        'codeValueProjectId': 18004,
        'codeType': {
          'codeTypeName': 'Strategic Objective',
          'codeTypeId': 10103,
          'assignments': [],
          'codeTypeCode': 'Strategic Objective',
          'workspace': 4
        },
        'projectId': 18201,
        'updateDate': '2018-06-13T15:51:11'
      },
      {
        'codeValue': {
          'codeTypeName': 'Estimated Project Size',
          'codeValueId': 8408,
          'parentCodeValue': 0,
          'codeValueName': 'Large',
          'codeValueCode': '3',
          'codeTypeId': 10102,
          'sequenceNumber': 0,
          'updateDate': '2018-06-13T12:22:18'
        },
        'codeValueProjectId': 18005,
        'codeType': {
          'codeTypeName': 'Estimated Project Size',
          'codeTypeId': 10102,
          'assignments': [],
          'codeTypeCode': 'Estimated Project Size',
          'workspace': 4
        },
        'projectId': 18201,
        'updateDate': '2018-06-13T15:51:11'
      },
      {
        'codeValue': {
          'codeTypeName': 'Current Phase',
          'codeValueId': 8404,
          'parentCodeValue': 0,
          'codeValueName': 'Implementation',
          'codeValueCode': 'IMPL',
          'codeTypeId': 10101,
          'sequenceNumber': 300,
          'updateDate': '2018-06-13T12:22:18'
        },
        'codeValueProjectId': 18006,
        'codeType': {
          'codeTypeName': 'Current Phase',
          'codeTypeId': 10101,
          'assignments': [],
          'codeTypeCode': 'Current Phase',
          'workspace': 4
        },
        'projectId': 18201,
        'updateDate': '2018-06-13T15:51:11'
      }
    ],
    'projectFinancial': {
      'proposedBudgetBaseUndistributed': 0,
      'forecastCostUndistributed': 0,
      'plannedBudgetUndistributed': 0,
      'proposedPlannedVar': 0,
      'forecastCurrApprVar': 0,
      'spendForecastVar': 0,
      'currentApprovedSpendVariance': 0,
      'proposedForecastVariance': 0,
      'spendPlannedVariance': 0,
      'allocatedFundPlannedBudgetVariance': 0,
      'allocatedFundForecastVariance': 0,
      'allocatedFundApprovedBudgetVariance': 0,
      'projectId': 18201,
      'updateDate': '2018-06-13T15:51:11'
    },
    'linkForecastToSpend': false,
    'isPSyncManaged': false,
    'calendarId': 0,
    'projectName': '4G',
    'workspaceId': 4,
    'projectCashFlows': [],
    'projectConfiguredFields': {
      'costFlexMap': {},
      'textFlexMap': {
        'N': '4G'
      },
      'otherFlexMap': {
        'SCORE': 20,
        'CURRENT_DELIVERY_PROGRAMME': 'true'
      },
      'projectId': 18201,
      'updateDate': '2018-07-18T08:26:06'
    },

    'projectId': 18201,
    'status': 'ACTIVE',
    'startDate': '2016-04-01T00:00:00.+0000',
    'sequenceNumber': 10,
    'updateDate': '2018-06-13T15:51:11'
  }];



const compare = (n, e) => {return n.code === e.projectCode};
const findProject = curry(function findProject(existing: Array<[]>, projects: Array<{}>){
  //console.log(projects);

  let x = differenceWith(compare)(projects)(existing);
  return x;
});


test('gets difference between both inputs',()=>{
  expect(findProject(existing)(data)).toEqual(data)
})
