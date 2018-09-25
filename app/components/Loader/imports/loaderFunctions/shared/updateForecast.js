const axios = require('axios')
const xlsx = require('xlsx')
const R = require('ramda')
const he = require('he')
const config = {
  baseURL: 'https://rpcuk-prime-eu.oracleindustry.com/primeapi/restapi',
  auth: {
    username: 'james.bentley@rpc.uk.com',
    password: '8Cv$V/3V'
  }
}

const xl= xlsx.readFile('C:/users/james/testing ground/book.xlsx', )
console.log(Object.keys(xl.Sheets));
const json = xlsx.utils.sheet_to_json(xl.Sheets['Forecast  JS'])
console.log(json);

for (let x of json) {
  console.log(x['Client']);
}




 axios.get('/project/workspace/22001',config).then(p=>{
   console.log(Object.keys(p));
   for (let x of p.data) {
     const code = he.decode(x.projectCode)
     console.log(code);
     let o = R.find(y=>{return y.Client===code})(json);
     console.log(o);
     if (o !== undefined) {
       const forecast = Number(o['Forecast Amount'])
       const updated = {...x,projectFinancial:{...x.projectFinancial,forecastCostDistributed:forecast}}
       console.log(updated);
       axios.put('/project/',updated,config).catch(e=>{
         console.log(e.response.data.message);
       })
     }

   }
}).catch(e=>{
  console.log(e);
})
