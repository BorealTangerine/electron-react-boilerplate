// @flow
import React, { Component } from 'react';
import App from './App';
import '../../resources/semantic/dist/semantic.global.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return <App />;
  }
}
