Documentation for RPCuk Prime API javascript interface

# API

The API is accessed by creating a new Prime object, which requires an Oracle Prime instance URL and a set of login details (i.e. username & password).

e.g.

`const P = new Prime(URL, username, password).`

Once this has been instantiated, all other methods can be utilised. Many methods use _Function Overloading_ - e.g. the `Prime.Project()` method can be called with no attributes to access **Project** methods, or passed an object/array of objects to call `Prime.post`.

e.g.

`Prime.Project().byId(4)` to get the project with id 4.

`Prime.Project(data: {} | [{}])` to post the project data to the _/project/_ endpoint.

All functions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

##Call

This is a superclass that **Prime** inherits from; Included in this documentation for brevity.

The call class has the following methods:

- get: (url) ⇒ axios response
- post: (url, data) ⇒ axios response
- put: (url, data) ⇒ axios response

These methods use [axios](https://github.com/axios/axios) to call endpoints on the provided Oracle Prime instance.

## Prime

The main class of the API. As it extends from the **Call** class, it inherits its methods:

- get: (url) ⇒ axios response
- post: (url, data) ⇒ axios response
- put: (url, data) ⇒ axios response

it also has the following methods:

- **parse(axios response)** - waits for the axios response to return and then returns depending on the status code of the response:
  - **200**: response.data
  - **204**: S.Nothing()
  - **other**: undefined (to be changed)

and the following static methods:

- **login(url, username, password)**

The following Oracle Prime elements also have associated methods accessed by first calling the method name with no parameters, then one of its sub-methods.

### Project

- **get(url)** - _generic get. can be used for any project function._

- **post(data)** - _creates a new project with the given project data._

- **put(data)** - _updates a project with the given project data._

- **send(data)** - _checks if data has projectId as a property, then calls put if it does and post if it doesn't_

- **byId(id)** - _returns project with given id_

- **byWorkspaceId(id)** - _view all projects for the given workspace ID_

- **byProjectCode(code)** - _view all projects with the given code._

- **byName(name)** - _view all projects with the given name_

- **byCode(projectCode, workspaceCode)** - _view the project with the given projectCode for the given workspace with code workspaceCode_

- **sort(projects)** - `Array<project> ⇒ Array<{[workspace]:project}>`

-**splitExisting(e, n)** - `Array<project>, Array<project> ⇒ {existing: Array<[existing,new], nonexisting: Array<project>}`

### Workspace

- **get(url)** - _generic get. can be used for any workspace function._
- **post(data)** - _creates a new workspace with the given workspace data._
- **put(data)** - _updates a workspace with the given workspace data._
- **send(data)** - _checks if data has workspaceId as a property, then calls put if it does and post if it doesn't_
- **byId(id)** - _returns workspace with given id_

- **unique(projects)** - `Array<project> ⇒ Array<workspaceCode>` - returns list of unique workspaces from given projects

- **map(workspaces)** - `Array<workspaceCode> ⇒ Map<workspaceCode:workspace>`

### Activity

### Task

###CodeType

- **get(url)**
- **post(data)**
- **put(data)**
- **send(data)**

- **byWorkspaceId(id)** - return all codeTypes associated with the given workspace.

# [Object Schemas](Schemas.md)
