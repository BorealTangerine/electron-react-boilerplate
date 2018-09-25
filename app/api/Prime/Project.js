/*@flow*/
import PrimeObject from './PrimeObject';
import type Prime from './Prime';
import {compose, equals, curry, has, find, map, mapObjIndexed,  prop, differenceWith} from 'ramda';
import * as S from 'sanctuary';
import {sortArrayByProp} from '../lib/sortByProp';

class Project extends PrimeObject{
  Prime: Prime
  constructor(Prime: Prime){
    super(Prime,'project');
  }

  send = (project: {projectId?: number}) => {
    return has('projectId')(project) ? this.put(project):this.post(project);
  }

  byId = (id: number) => {
    return this.get(String(id));
  }

  byWorkspaceId = (id: number) => {
    return this.get('/workspace/'+String(id));
  }

  byProjectCode = (code: string) => {
    return this.get('/code/'+code);
  }

  byName = (name: string) => {
    return this.get('/name/'+name);
  }

  byCode = (projectCode: string,workspaceCode: string) => {
    return this.get(`/byItemCode?workspaceCode=${workspaceCode}&projectCode=${projectCode}`);
  }

  sort = (projects: Array<{}>) => sortArrayByProp('workspace')(projects)

  splitExisting = async (existing: Promise<Array<[]>>, newProjects: Array<{}>): {existing: Array<{}>, nonexisting: Array<{}>} => {
    console.log(existing);
    let existingProjects = await existing;
    let projects = this.sort(newProjects)
    console.log(projects);
    return mapObjIndexed(findProject(await existingProjects))(projects)
  }
}

const compare = (n, e) => {return n.code === e.projectCode;};

const findProject = curry(function findProject(existing: Array<[]>, projects: Array<{}>, workspace: string){
  //console.log(projects);

  let e = find(compose(equals(workspace),prop(0)))(existing);
  let existingProjects = e[1]
  console.log(e[1]);
  let x = differenceWith(compare)(projects)(existingProjects)
  console.log(x);
  return x
  // let existingProjects = prop(1)(existing)



})

export default Project;
