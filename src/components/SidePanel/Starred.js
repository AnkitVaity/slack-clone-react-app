import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';

class Starred extends React.Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    activeChannel: '',
    starredChannels: []
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListners(this.state.user.uid);
    }
  }

  addListners = (userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_added', snap => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          starredChannels : [...this.state.starredChannels, starredChannel]
        });
      });

      this.state.usersRef
        .child(userId)
        .child('starred')
        .on('child_removed', snap => {
          const channelToRemove = { id: snap.key, ...snap.val() };
          const filteredChannels = this.state.starredChannels.filter(channel => {
            return channel.id !== channelToRemove.id;
          });
          this.setState({ starredChannels: filteredChannels });
        })
  }

  displayChannels = starredChannels => (
    starredChannels.length > 0 && starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel) }
        active={channel.id === this.state.activeChannel}
        name={channel.name}
        style={{ opacity: 0.7 }}>
        <span><Icon name={'small star'} style={{color: '#00ffa6', float: 'left'}}/></span>{channel.name}
      </Menu.Item>
    ))
  )

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  }

  render() {
    const { starredChannels } = this.state;
    return (
      <Menu.Menu style={{paddingTop: '30px' }}>
        <Menu.Item>
          <span style={{ fontWeight: 'bold' }}>
            <Icon name='chevron down' /> Starred
          </span> {' '}
          ({ starredChannels.length })
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
