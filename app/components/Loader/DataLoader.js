import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { CloudCheckIcon, CloudUploadIcon, FileDownloadIcon } from 'mdi-react';
import UploadButton from './UploadButton';

type Props = {
  +template: string,
  +id: string
};

class DataLoader extends Component<Props> {
  state = {
    filename: 'select file...',
    data: null,
    uploaded: false,
    loading: false
  };

  // set state values depending on the file uploaded
  handleFile = file => {
    this.setState({ filename: file[0].name, data: file[0], uploaded: false });
  };

  // get the data from the uploaded file
  // readData = (file, reader) => (reader.readAsBinaryString(file))
  // //passes the loaded data to the loader's main function.
  sendData = () => {
    const { data, func } = this.state;
    if (data) {
      this.setState({ loading: true, uploaded: false });
      const reader = new FileReader();
      reader.readAsArrayBuffer(data);
      reader.onload = e => {
        func(e.target.result)
          .then(() => this.setState({ loading: false, uploaded: true }))
          .catch(error => {
            console.log(error);
          });
      };
    }
  };

  // checks if the state has been set to uploaded, changes the icon to reflect that
  handleUploadState = () => {
    const { uploaded } = this.state;
    switch (uploaded) {
      case true:
        return <CloudCheckIcon size={24} />;
      default:
        return <CloudUploadIcon size={24} />;
    }
  };

  render() {
    console.log(this);
    const { template, id } = this.props;
    const { filename, loading } = this.state;
    const uploadState = this.handleUploadState();
    return (
      <div className="loader-padding">
        <a href={template} title="click to download template" download>
          <Button
            floated="right"
            size="medium"
            compact
            style={{ marginLeft: '2em' }}
          >
            <FileDownloadIcon size={24} />
          </Button>
        </a>
        <UploadButton
          elementId={id}
          handleFile={this.handleFile}
          fileTypes=".xlsx"
        />
        <Message
          style={{
            height: '42.5px',
            width: '50%',
            overflow: 'hidden',
            marginTop: '0.0em',
            marginLeft: '0.5em',
            padding: '0.7em'
          }}
          content={filename}
          compact
        />
        <Button
          floated="right"
          onClick={this.sendData}
          basic
          compact
          loading={loading}
          size="medium"
        >
          {uploadState}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ login: { login } }) => ({ login });
export default connect(mapStateToProps)(DataLoader);
