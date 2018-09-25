/*this function returns all of the Code Types assigned to the given workspace*/

export function viewCodeTypes(workspaceId){
	
	
	let newLogin =  {...login,url: '/primeapi/restapi/codeType/workspace/'+workspaceId}
	let list = request.get(newLogin).then(
			(result)=>{return result})
		
	return list.await()
	
}