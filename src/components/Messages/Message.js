import React from 'react';
import { Comment, Feed, Image } from 'semantic-ui-react';
import moment from 'moment';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : 'message__notself';
}

const isImage = (message) => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({message, user}) => (
  <div className={`${isOwnMessage(message, user)} `}  style={{padding: '8px', borderRadius: '23px', opacity: '1', background: 'white'}}>
  {/*<Comment>
    <Comment.Avatar src={message.user.avatar}/>
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as='a'>{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
    </Comment.Content>
  </Comment> */}
  <Feed>
  <Feed.Event>
      <Feed.Label style={{border: '1px solid #858585', borderRadius: '50px', height: '35px'}} image={message.user.avatar} />
      <Feed.Content>
        <Feed.Summary>
          <a style={{color: 'black'}}>{message.user.name}</a>
          <Feed.Date>{timeFromNow(message.timestamp)}</Feed.Date>
        </Feed.Summary>
        {isImage(message) ? <Image src={message.image} className='message__image'/> :
        <Feed.Extra text>
          {message.content}
        </Feed.Extra>
      }
      </Feed.Content>
    </Feed.Event>
    </Feed>
  </div>
);

export default Message;
