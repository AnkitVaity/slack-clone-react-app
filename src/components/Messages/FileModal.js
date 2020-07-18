import React from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

// Note: we haven't added the functionality to add pdf file
class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ['image/jpeg', 'image/png', 'application/pdf']
  }

  addFile = event => {
    const file = event.target.files[0];
    console.log('file:', file);
    if (file) {
      this.setState({ file: file});
    }
  }

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name)};
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  }

  isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic dimmer={'blurring'} size="tiny" open={modal} onClose={closeModal}>
        <Modal.Header style={{color:'#00ffa6'}}>Select a File</Modal.Header>
        <Modal.Content>
          <Input onChange={this.addFile} fluid label="File types: jpg, png" name='file' type='file'/>
        </Modal.Content>
        <Modal.Actions>
          <Button circular color="red" inverted onClick={closeModal} icon='remove'></Button>
          <Button circular color="green" onClick={this.sendFile} inverted icon='checkmark'></Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default FileModal;
