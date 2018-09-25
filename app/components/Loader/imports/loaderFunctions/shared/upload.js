/*globals request*/
import { getProjects } from './getProjects';
//check if the project exists. If it does, add it to the puts list. If it doesn't, add it to the posts list.

export function uploadInit(projectsJson, map, errors) {
    getProjects(map, errors);
    var posts = [];
    var puts = [];
    //for each project in the projects sheet, check it exists in the data map and if it does, replace its projectId with the map's projectId (the actual Id, rather than the 'projectCode')
    _.forEach(projectsJson, function(object) {
        var ws = object.workspaceId;
        var projectCode = object.projectId;
        var check = _.find(map[ws].projects, function(item) {
            return projectCode == item.projectCode;
        });
        object.workspaceId = map[ws].id;
        if (check != undefined) {
            object.projectId = check.projectId;

            puts.push(object);
        }
        else {
            object.projectCode = object.projectId;
            posts.push(object);
        }

    });

    uploadData(posts, puts, errors);

}
export function uploadData(posts, puts, errors) {
    var newLogin = {
        ...login,
        url: '/primeapi/restapi/project/batch'
    };

    if (posts.length > 0) {
        console.log(posts[0])
        newLogin.body = posts;
        request.post(newLogin).then(console.log('posted ' + posts.length + ' projects'));

    } else if (posts.length == 0) {
        console.log('no posts necessary');
    }
    if (puts.length > 0) {
        newLogin.body = puts;
        request.put(newLogin).then(console.log('updated ' + puts.length + ' projects'));

    } else if (puts.length == 0) {
        console.log('no updates necessary');
    } else {
        errors.push('error occured');
    }

}
