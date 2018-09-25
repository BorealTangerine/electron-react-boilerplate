



export async function giveId(workspaceCode){

		    newLogin={...login, url:('/primeapi/restapi/workspace/code/'+workspaceCode)}

var Id = await request.get(newLogin)
    val =await  Id[0].workspaceId;
return val




    };
