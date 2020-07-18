import React from 'react';
import firebase from '../../firebase';
import { Button, Segment, Input } from 'semantic-ui-react';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';
// uuidv4 will create a random string
import uuidv4 from 'uuid/v4';

class MessageForm extends React.Component {
  state = {
    message: '',
    user: this.props.currentUser,
    errors: [],
    loading: false,
    modal: false,
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0
  }

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  // createMessage before image file upload integration
  // createMessage = () => {
  //   const message = {
  //     timestamp: firebase.database.ServerValue.TIMESTAMP,
  //     user: {
  //       id: this.state.user.uid,
  //       name: this.state.user.displayName,
  //       avatar: this.state.user.photoURL
  //     },
  //     content: this.state.message
  //   }
  //   return message;
  // }

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
    };
    if(fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
    }
    return message;
  }

  sendMessage = () => {
    const { getMessagesRef, currentChannel } = this.props;
    const { message } = this.state;

    if (message) {
      this.setState({ loading: true });
      //Send message
      getMessagesRef()
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] })
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false, errors: this.state.errors.concat(err)})
        })
    } else {
      this.setState({ errors: this.state.errors.concat({ message: 'Add a message'}) })
    }
  }


  // To determine which path to use depending on channel privacy
  getPath = () => {
    if(this.props.isPrivate) {
      return `chat/private-${this.props.currentChannel.id}`;
    } else {
      return 'chat/public';
    }
  }

  uploadFile = (file, metadata) => {
    console.log('upload file:', file, metadata);
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.getMessagesRef();
    // const filePath = `chat/public/${uuidv4()}.jpg`;
    // After isPrivate property is child_added
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState({
      uploadState: 'uploading',
      uploadTask:  this.state.storageRef.child(filePath).put(file, metadata) },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          this.setState({ percentUploaded });
        },
        err => {
          console.log(err);
          this.setState({ errors: this.state.errors.concat(err), uploadState: 'error', uploadTask: null });
        },
        () => {
          this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.sendFileMessage(downloadUrl, ref, pathToUpload);
          })
          .catch (err  => {
            console.log(err);
            this.setState({ errors: this.state.errors.concat(err), uploadState: 'error', uploadTask: null });
          })
         }
        )
       }
     )
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
       .push()
       .set(this.createMessage(fileUrl))
       .then(() => {
         this.setState(({ uploadState: 'done'}))
       })
       .catch(err => {
         console.error(err);
         this.setState({ errors: this.state.errors.concat(err)});
       })
  }

  render() {
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;

    return (
      <div className='message__form'>
      <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded}/>
        {/*<Input className={ errors.some(error => error.message.includes('message')) ? 'error' : ''} onChange={this.handleChange} fluid icon={{ name: 'paperclip', circular: true, link: true, onClick: this.sendMessage }} iconPosition='left' name='message' size='small' style={{ marginBottom: '10px'}} label={<Button onClick={this.sendMessage} icon={'chevron circle right'} />} labelPosition='right' placeholder='Type a message' /> */}
        <div className="ui small left icon action input" style={{ position: 'fixed', marginLeft: '334px', left: '0', right: '27.3em', bottom: '1em'}}>
          <i className="paperclip link grey icon" circular= "true" link= "true" disabled={uploadState==='uploading'} onClick= {this.openModal} style={{ zIndex: '201'}}  ></i>
          <input className={ errors.some(error => error.message.includes('message')) ? 'error' : ''} onChange={this.handleChange} value={message} name='message' style={{ borderRadius: '50px', border: '2px solid white', backgroundColor: 'black', color: 'white', opacity: 0.9, zIndex: '200'}} type="text" placeholder="Type a message"/>
          <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile}/>
          <Button style={{ zIndex: '201', background: 'white'}} disabled={loading} onClick={this.sendMessage} icon={'black small chevron right'} />
        </div>
      </div>
    )
  }
}

export default MessageForm;
