import React from 'react';
import { Segment, Accordion, Header, Icon, Image } from 'semantic-ui-react';

class MetaPanel extends React.Component {
  state = {
    channel: this.props.currentChannel,
    privateChannel: this.props.isPrivateChannel,
    activeIndex: 0
  }

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex, privateChannel, channel } = this.state;

    if (privateChannel) return null;

    return(
      <Segment clearing style={{ background: '#0a0a0a'}} loading={!channel}>
        <Header style={{ background: '#242424', color: 'white', opacity:'0.9', border: 'none'}} as='h3' attached='top' >
          About {channel && channel.name}
        </Header>
        <Accordion style={{opacity: '0.9'}} inverted  attached='true'>

          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.setActiveIndex}>
            <Icon name='dropdown'/>
            <Icon name='info' />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.setActiveIndex}>
            <Icon name='dropdown'/>
            <Icon name='user' />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            posters
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.setActiveIndex}>
            <Icon name='dropdown'/>
            <Icon name='pencil alternate' />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
          <Header style={{color: 'white'}} as='h3'>
            <Image circular src={channel && channel.createdBy.avatar} />
            {channel && channel.createdBy.name}
          </Header>
          </Accordion.Content>

        </Accordion>
      </Segment>
    )
  }
}

export default MetaPanel;
