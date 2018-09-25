type Loader = {
  name: string,
  id: string,
  fun: () => Promise<boolean>,
  template: string,
  exceptions: Array<Exception>
};

type Exception = {
  message: string,
  type: string
};

export type State = {
  +loaders: Array<Loader>
};

export type Action = {
  type: string,
  data?: {}
};
