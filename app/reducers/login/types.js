type Field = {
  value: string,
  valid: boolean,
  error: string,
  defaultError: string
};

type Fields = {
  username: Field,
  password: Field,
  url: Field
};

type Login = {
  username: string,
  password: string,
  url: string
};

export type State = {
  +error: boolean,
  +loggedIn: boolean,
  +login: Login,
  +fields: Fields
};

export type Action = {
  +type: string,
  data?: {} | string
};
