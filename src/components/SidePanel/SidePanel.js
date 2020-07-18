import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import Starred from './Starred';
import DirectMessages from './DirectMessages';
import { connect } from 'react-redux';

class SidePanel extends React.Component {
  render() {
    return(
      <Menu inverted size="large" fixed="left" vertical style={{ background: '#0a0a0a', fontSize: '1.2rem'}}>
        <UserPanel />
        <Starred currentUser={this.props.currentUser}/>
        {/* NOTE: we can add the connect function to Channels.js to get user information if we dont want to send currentUser as props to Channels */}
        <Channels currentUser={this.props.currentUser} />
        <DirectMessages currentUser={this.props.currentUser}/>
      </Menu>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(SidePanel);
