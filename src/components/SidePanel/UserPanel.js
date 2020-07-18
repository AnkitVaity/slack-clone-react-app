import React from 'react';
import { Grid, Header, Icon, Dropdown, Image , Segment} from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';

class UserPanel extends React.Component {
  dropdownOptions = () => [
      {
        key: 'user',
        text: <span>Signed in as <strong>{this.props.currentUser.displayName}</strong></span>,
        disabled: true
      },
      {
        key: 'avatar',
        text: <span>Change Avatar</span>,
        icon: <Image style={{border: '1px solid #a6a6a6'}} src={this.props.currentUser.photoURL} spaced='right' avatar/>
      },
      {
        key: 'signout',
        text: <span onClick={this.handleSignout}>Sign Out</span>,
        icon: 'sign out'
      }
    ]

    handleSignout = () => {
      firebase
        .auth()
        .signOut()
        .then(() => console.log("signed out"));
    }

  render() {
    console.log('currentUser', this.props.currentUser);
    return (
      <Grid style={{ background: '#0a0a0a'}}>
      <Segment style={{ height: '90px'}} inverted>
        <Grid.Column style={{ marginTop: '20px'}}>
          <Grid.Row style={{ padding: '1.2m', margin: 0}}>
            <Header inverted floated='left' as='h1' style={{ color: '#00ffa6'}}>𝖙 𝖗 𝖎 𝖇 𝖊</Header>
          </Grid.Row>
         <Header inverted floated='right' style={{ padding: '0.25em' }} as='h5' >
           <Dropdown trigger={<span style={{ opacity: 0.8}}>My Account</span>} options={this.dropdownOptions()} pointing='top right' />
         </Header>
        </Grid.Column>
      </Segment>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(UserPanel);
