/* @flow */
import Nothing from 'sanctuary';
import { prop } from 'ramda';
import Call from './connections';
import Project from './Project';
import Workspace from './Workspace';
import CodeType from './codeType';
import Field from './field';

/* Base object to create when working with prime data. requires url, username and password from state to instantiate its super-class Call (see connections.js). */
class Prime extends Call {
  static login = Call.login;

  project = (p?: {
    projectName: string,
    projectCode?: string,
    projectId?: number
  }) => {
    const P = new Project(this);
    return p ? P.send(p) : P;
  };

  workspace = (w?: { workspaceId?: number }) => {
    const W = new Workspace(this);
    return w ? W.send(w) : W;
  };

  codeType = (c?: { codeTypeId?: number }) => {
    const C = new CodeType(this);
    return c ? C.send(c) : C;
  };

  field = () => new Field(this);

  parse = async (value: Promise<{ status: number, data: {} }>) => {
    const response = await value;
    const status = prop('status')(response);
    switch (status) {
      case 200:
        return response.data;
      case 204:
        return Nothing();
      default:
        return undefined;
    }
  };
}

export default Prime;
export type prime = Prime;
