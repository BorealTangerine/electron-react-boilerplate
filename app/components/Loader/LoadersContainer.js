// @flow
// REVIEW: contains the components used for operation and function of each loader card.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';
import LoaderTabs from './LoaderTabs';
import DataLoader from './DataLoader';
import createConfiguredFields from './imports/loaderFunctions/shared/createConfiguredFields';
import createCodes from './imports/loaderFunctions/shared/createCodes';
import '../../../resources/semantic/dist/semantic.global.css';
import type { Loader } from './loaders';

type Props = {
  loaders: Array<Loader>
};

class LoadersContainer extends Component<Props> {
  createFields = createConfiguredFields;

  createCodes = createCodes;

  createLoaders = () => {
    const { loaders } = this.props;
    return loaders.map(loader => (
      <div className="loader-spacing" key={loader.id}>
        <LoaderTabs
          key={loader.id}
          title={loader.name}
          fields={<DataLoader id={loader.id} fun={this.createFields} />}
          loader={
            <DataLoader
              key={loader.id}
              id={loader.id}
              title={loader.name}
              fun={loader.fun}
              template={loader.template}
            />
          }
          codes={
            <DataLoader key={loader.id} id={loader.id} fun={this.createCodes} />
          }
        />
      </div>
    ));
  };

  render() {
    return <Item.Group attached="false">{this.createLoaders()}</Item.Group>;
  }
}

const mapStateToProps = ({ loader: { loaders } }) => ({ loaders });
export default connect(mapStateToProps)(LoadersContainer);
