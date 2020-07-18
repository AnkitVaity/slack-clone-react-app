import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    channel: null,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: [],
    modal: false,
    firstLoad: true
  }

  componentDidMount() {
    this.addListners();
  }

  componentWillUnmount() {
    this.removeListers();
  }

  addListners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      console.log("loadedChannels", loadedChannels);
      this.setState({channels: loadedChannels}, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on('value', snap => {
      if (this.state.channel) {
        this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
      }
    });
  }

  handleNotifications= (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(notification => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    }else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  }

  removeListers = () => {
    this.state.channelsRef.off();
  }

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.props.setPrivateChannel(false);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  }

  addChannel = () => {
    const {channelsRef, channelName, channelDetails, user} = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: ''});
        this.closeModal();
        console.log('Channel added');
      })
      .catch(err => {
        console.error(err);
      })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index] = 0;
      this.setState({ notifications: updatedNotifications });
    }
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  }

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel) }
        active={channel.id === this.state.activeChannel}
        name={channel.name}
        style={{ opacity: 0.7 }}>
        <span><Icon name={'genderless'} style={{color: '#00ffa6', float: 'left'}}/></span>{channel.name}
        {this.getNotificationCount(channel) && (
          <Label color='green'>{this.getNotificationCount(channel)}</Label>
        )}
      </Menu.Item>
    ))
  )

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  isFormValid=({ channelName, channelDetails }) => channelName && channelDetails;

  closeModal = () => this.setState({modal: false})
  openModal = () => this.setState({modal: true})

  render() {
    const { channels, modal } = this.state;
    return(
      <React.Fragment>
      <Menu.Menu style={{ paddingBottom: '10px', paddingTop: '10px' }}>
        <Menu.Item>
          <span style={{ fontWeight: 'bold' }}>
            <Icon name='chevron down' /> Channels
          </span> {' '}
          ({ channels.length }) <Icon name='add' onClick={this.openModal}/>
        </Menu.Item>
        {this.displayChannels(channels)}
      </Menu.Menu>


      {/*Add channel modal
      if modal is true we will be able to see our Modal*/}
      <Modal basic dimmer={'blurring'} open={modal} size="tiny" onClose = {this.closeModal}>
        <Modal.Header style={{color:'#00ffa6'}} >Add Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input fluid label='Name of Channel' name='channelName' onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <Input fluid label='About Channel' name='channelDetails' onChange={this.handleChange} />
            </Form.Field>
          </Form>
        </ Modal.Content>

        <Modal.Actions>
          <Button circular color="red" inverted onClick={this.closeModal} icon='remove'></Button>
          <Button circular color="green" inverted onClick={this.handleSubmit} icon='add'></Button>
        </Modal.Actions>
      </ Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
