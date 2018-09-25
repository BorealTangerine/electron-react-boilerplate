import React, { Component } from 'react';
import { UploadIcon } from 'mdi-react';
import ReactFileReader from 'react-file-reader';
import { Button } from 'semantic-ui-react';

type Props = {
  +handleFile: void
};

export default class UploadButton extends Component<Props> {
  render() {
    const { handleFile } = this.props;
    return (
      <ReactFileReader handleFiles={handleFile} fileTypes=".xlsx">
        <Button floated="left" color="blue" size="medium" compact>
          <UploadIcon size={24} />
        </Button>
      </ReactFileReader>
    );
  }
}
