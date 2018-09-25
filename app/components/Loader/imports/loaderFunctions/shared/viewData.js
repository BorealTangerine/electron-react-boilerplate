//returns information on a workspace from a given URL.
/*export async function byWorkspaceId(workspaceId, url) {
    const login = this.store.loginDetails
    const connection = this.store.asteroid
    let newLogin = { ...login,
        url: url + workspaceId
    };

    let data = connection.call('call', headLogin).then((res) => {
        if(res.status === 200) {
            return connection.call('call', newLogin).then((response) => {
                if(response.success === true) {
                    return response.data
                } else if(response.success === false) {
                    //console.log('send error');
                    this.dispatch({ type: 'SEND_EXCEPTIONS', data: response.value, });
                }
            })
        }
    });
    return await data
}
*/
export async function byWorkspaceId(workspaceId, url) {
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;
    let newLogin = { ...login,
        url: url + workspaceId
    };

    let data =  connection.call('call', newLogin).then((response) => {
        if(response.success === true) {
            return response.data;
        } else if(response.success === false) {
            //console.log('send error');
            this.dispatch({ type: 'SEND_EXCEPTIONS', data: response.value, });
        }
    });


    return await data;
}

export function viewCompany(name){
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;
    const endpoint = '/primeapi/restapi/company/name'+name;
    const company = connection.call('call',{...login,url:endpoint}).then(res=>{
        if(res.success === true){
            return res.data;
        } else if (res.success === false){
            this.dispatch({type:'SEND_EXCEPTIONS',data:res.value});
        }
    });
    return company;

}
