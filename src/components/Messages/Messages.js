import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { connect } from 'react-redux';

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    privateChannel: this.props.isPrivate,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    isChannelStarred: false,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: []
  }

  componentDidMount() {
    const {user, channel} = this.state;
    console.log('channel',channel);

    // If there is a channel as well a user
    if(channel && user) {
      this.addListners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  addListners = channelId => {
    this.addMessageListner(channelId);
  }

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred});
        }
      })
  }

  addMessageListner = channelId => {
    let loadedMessages = [];
    // this.state.messagesRef.child(channelId).on('child_added', snap => {
    //   loadedMessages.push(snap.val());
    //   console.log('loadedMessages',loadedMessages);
    //   this.setState({ messages: loadedMessages, messagesLoading: false});
    //
    //   this.countUniqueUsers(loadedMessages);
    // });

    // After isPrivate channel
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      console.log('loadedMessages',loadedMessages);
      this.setState({ messages: loadedMessages, messagesLoading: false});

      this.countUniqueUsers(loadedMessages);
    });
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleStar = () => {
    // This will set it to opposite value
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel());
  }

  starChannel = () => {
    if ( this.state.isChannelStarred ) {
      console.log('star');
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .update({
          [this.state.channel.id]: {
            name: this.state.channel.name,
            details: this.state.channel.details,
            createdBy: {
              name: this.state.channel.createdBy.name,
              avatar: this.state.channel.createdBy.avatar
            }
          }
        });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  }

  displayMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.props.currentUser}/>
    ))
  )

  displayChannelName = channel => channel ? `${channel.name}` : '';

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    // gi stands for apply regex globally and case insensitively
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      // message.content && is added to check if its not a image
      if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  }

  render() {
    const { messagesRef, messages, channel, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred } = this.state;
    const currentChannel = this.props.currentChannel;
    const currentUser = this.props.currentUser;

    return(
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivate={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment style={{ background: 'black', border: '5px solid #0a0a0a'}}>
          <Comment.Group className='messages'>
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivate={privateChannel}
          getMessagesRef={this.getMessagesRef}
          />
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  currentChannel: state.channel.currentChannel,
  currentUser: state.user.currentUser,
  isPrivate: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(Messages);
