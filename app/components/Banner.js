// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Visibility, Button, Dropdown, Menu, Image } from 'semantic-ui-react';
import type { Dispatch } from '../reducers/types';

type Props = {
  username: string,
  dispatch: Dispatch
};

class Banner extends Component<Props> {
  logout = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'USER_LOGOUT' });
  };

  render() {
    const { username } = this.props;
    return (
      <Visibility fixed="true">
        <Menu size="large" inverted>
          <Menu.Item position="left">
            <Image src="/logo.png" alt="RPCuk" size="tiny" />
          </Menu.Item>

          <Menu.Item position="right">
            <Dropdown text={username} pointing="top right">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Button secondary fluid onClick={this.logout}>
                    Logout
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </Visibility>
    );
  }
}

const mapStateToProps = ({ login: { details } }) => ({ details });

export default connect(mapStateToProps)(Banner);
