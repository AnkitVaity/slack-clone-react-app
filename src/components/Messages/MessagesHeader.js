import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
  render() {
    const {channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivate, handleStar, isChannelStarred} = this.props;

    return (
      <Segment clearing style={{ background: '#0a0a0a'}}>
        {/*Channel Title */}
        <Header fluid='true' as='h3' floated='left' style={{ marginBottom: 0, color: 'white', opacity:0.9}}>
          <span>
            <Icon name={isPrivate ? 'user' : 'users'} color='grey' />
            {' '}{channelName}{' '}
            {!isPrivate && <Icon name={'star outline'} onClick={handleStar} color={isChannelStarred ? 'yellow' : 'black'} /> }
          </span>
          <Header.Subheader style={{ marginBottom: 0, color: 'grey', opacity:0.9}} >{!isPrivate ? numUniqueUsers : ''}</Header.Subheader>

        {/*Channel Search Input */}
        </Header>
        <Header floated='right'>
          <div className="field"><div className="ui mini right icon input">
            {/* Search Loading only works with semantic ui Input tag */}
            <input  loading={searchLoading} onChange={handleSearchChange} style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} name="searchTerm" placeholder="Search Messages"/><Icon style={{ color: 'white'}} className="search icon" />
          </div></div>
        </Header>
      </Segment>
    )
  }
}

export default MessagesHeader;
