 import React, { Component } from 'react';
 import { Grid } from 'semantic-ui-react';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import { connect } from 'react-redux';

const App = ({currentChannel, isPrivateChannel}) => (
  <Grid columns='equal' className='app' style={{ color: 'white'}}>
    <ColorPanel />
    <SidePanel />

    <Grid.Column style={{ marginLeft: 320}}>
      <Messages key={currentChannel && currentChannel.id} currentChannel={currentChannel}/>
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel key={currentChannel && currentChannel.id} currentChannel={currentChannel} isPrivateChannel={isPrivateChannel}/>
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App);
