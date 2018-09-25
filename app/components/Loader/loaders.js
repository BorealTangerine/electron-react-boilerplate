// @flow

import projectLoaderFunction from './imports/loaderFunctions/projectLoaderV3';
import createActivities from './imports/loaderFunctions/createActivities';

import createTasks from './imports/loaderFunctions/createTasks';

// IDEA: change the loader object to contain an array of tabs, each with id/title/function/template. Each loader container will have a unique ID and a title. Each loader tab will store

// the base loader object
export class Loader {
  id: string;

  name: string;

  fun: Promise<boolean>;

  template: string;

  constructor(
    id: string,
    name: string,
    fun, // : Promise<boolean>,
    template // : string = ''
  ) {
    this.id = id;
    this.name = name;
    this.fun = fun;
    this.template = template;
    this.exceptions = [];
  }
}

const projectLoader = new Loader(
  'PROJECT',
  'Project Loader',
  projectLoaderFunction,
  './Loader Templates/Projects Template.xlsx'
);

const activityLoader = new Loader(
  'ACTIVITY',
  'Activity Loader',
  createActivities,
  '../../resources/Loader Templates/Activities Template.xlsx'
);

const taskLoader = new Loader(
  'WORK_MANAGER_TASK',
  'Task Loader',
  createTasks,
  './Loader Templates/Tasks Template.xlsx'
);

const loaders = [projectLoader, activityLoader, taskLoader];
export default loaders;
