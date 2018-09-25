//for each workspace in the map, get its associated projects, then return new array with projects map to workspaceId.
export async function getProjects(map) {
    console.log(map);
    const login = this.store.loginDetails;
    const connection = this.store.asteroid;
    var newMap = await map.map( async (i) => {

        let key = i[0];
        let value = await i[1];
        let newLogin = { ...login, url: '/primeapi/restapi/project/workspace/' + value, };

        return connection.call('call', newLogin).then((response) => {

            if (response.success === true) {
                switch (response.status) {
                    case 204:
                        return [key,[]];

                    default:
                        return [key, response.data];
                }
            } else if (response.success === false) {
                this.dispatch({ type: 'SEND_EXCEPTIONS', data: 'v'+response.value, });
            }
        });
    });

    return Promise.all(newMap);
}
