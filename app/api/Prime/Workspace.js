/* @flow */

import { has, prop, uniq, map, path } from 'ramda';
import PrimeObject from './PrimeObject';
import type { prime } from './Prime';

class Workspace extends PrimeObject {
  Prime: prime;

  constructor(Prime: prime) {
    super(Prime, 'workspace');
  }

  send = (workspace: { workspaceId?: number }) =>
    has('workspaceId')(workspace) ? this.put(workspace) : this.post(workspace);

  byId = (id: number) => this.get(String(id));

  byCode = (code: string) => this.get(`code/${code}`).then(path(['data', 0]));

  unique = (projects: Array<{ workspace: string }>): Array<string> =>
    uniq(map(prop('workspace'))(projects));

  map = (workspaces: []) =>
    map((workspace: string) => [
      workspace,
      this.Prime.workspace().byCode(workspace)
    ])(workspaces);
}

export default Workspace;
