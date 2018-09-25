const axios = require('axios')
const R = require('ramda')
const config = {
    baseURL:'https://rpcuk-prime-eu.oracleindustry.com/primeapi/restapi',
    auth:{
        username: 'james.bentley@rpc.uk.com',
        password: '8Cv$V/3V'

    }
}

axios.get('/project/workspace/20001',config).then(x=>{
    let projects = x.data
    for (let i of projects) {
        let id = i.projectId
        axios.delete(`/project/${id}?cascadeOnDelete=true`,config).catch(x=>console.log(x))
    }
}).catch(x=>console.log(x.response.data.message))
