// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Popup,
  Modal,
  Input,
  Form,
  Header,
  Label,
  Message
} from 'semantic-ui-react';
import { all, any, propEq, values } from 'ramda';
import Prime from '../api/Prime/Prime';
// import checkLogin from './checkLogin';
import type { Dispatch } from '../reducers/types';
import type { Fields, Login } from '../reducers/login/login';
import { isValidInput, isValidURL } from '../actions/validateUserInput';

type Props = {
  loggedIn: boolean,
  login: Login,
  error: boolean,
  fields: Fields,
  dispatch: Dispatch
};

class LoginScreen extends Component<Props> {
  // handleChange = ({ target: { value, id } }) => {
  //   const { dispatch } = this.props;
  //   const payload = { [id]: { value, valid: true } };
  //   dispatch({ type: 'CHANGE_VALUE', data: payload });
  // };
  handleChange = ({ target: { value, id } }) => {
    const {
      dispatch,
      fields: {
        [id]: { defaultError }
      }
    } = this.props;
    const payload = { [id]: { value, valid: true, error: defaultError } };
    dispatch({ type: 'CHANGE_VALUE', data: payload });
  };

  checkUrl = ({ target: { value } }) => {
    const { dispatch } = this.props;
    const valid = isValidURL(value);
    dispatch({ type: 'CHANGE_VALUE', data: { url: { valid } } });
  };

  checkInput = ({ target: { value, id } }) => {
    const { dispatch } = this.props;
    const valid = isValidInput(value);
    dispatch({ type: 'CHANGE_VALUE', data: { [id]: { valid } } });
  };

  validLogin = fields => all(propEq('valid')(true))(values(fields));

  handleLogin = async () => {
    console.log('checking login');
    const { fields, dispatch } = this.props;
    const {
      username: { value: username },
      password: { value: password },
      url: { value: url }
    } = fields;

    const validLogin = this.validLogin(fields);
    if (validLogin === true) {
      const { success, error } = await Prime.login(username, password, url);
      if (success === true) {
        dispatch({ type: 'USER_LOGIN' });
        return true;
      }
      console.log(error);
      dispatch({ type: 'CHANGE_VALUE', data: setMessage(error) });
      return false;
    }
    // switch (validLogin) {
    //   case true: {
    //     console.log('trying to log in to Prime');
    //     const p = Prime.login(username, password, url)
    //       .then(x => {
    //         console.log(x);
    //         dispatch({ type: 'USER_LOGIN' });
    //         return true;
    //       })
    //       .catch(() => false);
    //       console.log(p);
    //     break;
    //   }
    //   default:
    //     return false;
    // }
  };

  render() {
    const { loggedIn, fields, error } = this.props;
    console.log(this);
    const { username, password, url } = fields;
    return (
      <Modal
        open={!loggedIn}
        basic
        size="small"
        closeOnEscape={false}
        closeOnDimmerClick={false}
        style={{ top: '25%' }}
      >
        <Header icon="browser" content="  Enter Prime Details" />
        <Modal.Content>
          <Form inverted fluid="true" onSubmit={this.handleLogin} error={error}>
            <Form.Field error={!username.valid} onChange={this.handleChange}>
              Username
              <Popup
                size="mini"
                position="right center"
                open={!username.valid}
                content={username.error}
                trigger={
                  <Input
                    placeholder="Username"
                    id="username"
                    required
                    autoFocus
                    onBlur={this.checkInput}
                  />
                }
              />
            </Form.Field>

            <Form.Field error={!password.valid} onChange={this.handleChange}>
              Password
              <Popup
                size="mini"
                position="right center"
                open={!password.valid}
                content={password.error}
                trigger={
                  <Input
                    placeholder="Password"
                    type="password"
                    id="password"
                    required
                    onBlur={this.checkInput}
                  />
                }
              />
            </Form.Field>

            <Form.Field error={!url.valid} onChange={this.handleChange}>
              URL
              <Popup
                size="mini"
                position="right center"
                open={!url.valid}
                content={url.error}
                trigger={
                  <Input
                    placeholder="URL"
                    id="url"
                    type="text"
                    required
                    onBlur={this.checkUrl}
                  />
                }
              />
            </Form.Field>
            <Button
              color="green"
              inverted
              type="submit"
              disabled={any(propEq('valid')(false))(values(fields))}
            >
              Go
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

function setMessage(error) {
  const { type, reason } = error;
  switch (type) {
    case 'url': {
      return { url: { error: reason, valid: false } };
    }
    case 'user': {
      return { username: { error: reason, valid: false } };
    }
    case 'other': {
      return { username: { error: reason, valid: false } };
    }
    default:
      return {};
  }
}

const mapStateToProps = ({ login: { loggedIn, login, fields } }) => ({
  loggedIn,
  login,
  fields
});
export default connect(mapStateToProps)(LoginScreen);
