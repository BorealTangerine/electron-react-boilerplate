import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';

type Props = {
  +title: string,
  loader: {}
};

export default class LoaderTabs extends Component<Props> {
  panes = [
    { menuItem: 'Upload', render: () => this.props.loader },
    { menuItem: 'Create Configured Fields', render: () => this.props.fields },
    { menuItem: 'Create Codes', render: () => this.props.codes }
  ];

  render() {
    const { title } = this.props;
    return (
      <div>
        <h3 className="loader-header">{title}</h3>
        <div className="ui segment">
          <Tab
            panes={this.panes}
            menu={{
              tabular: false,
              attached: false,
              secondary: true,
              pointing: true
            }}
          />
        </div>
      </div>
    );
  }
}
