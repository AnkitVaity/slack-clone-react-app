import React from 'react';
import { Grid, Form, Input, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import swal from 'sweetalert';
import './sweetAlert.css';


class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors: '',
    loading: false
  };

//------------------------------------------------------------------------------
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value})
  };
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  isFormValid = ({ email, password }) => email && password;

  handleSubmit = (event) => {
    event.preventDefault();
    // Form Validation
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true});
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
          swal({
            title: `Welcome back ${signedInUser.user.displayName} :)`,
            text: " ",
            timer: 1500,
            buttons: false
          });
        })
        .catch(err => {
          console.error('login error',err);
          this.setState({ errors: this.state.errors.concat(err), loading: false });
          swal(err.message,{
            icon: "error",
            timer: 2000,
            buttons: false
          });
        });
     }
  };

//----------------------------------------------------------------------------
render() {

  // Destructuring state object
  const { email, password, errors, loading } = this.state;

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 400 }}>
        <Header style={{ marginBottom: "30px", color: '#00ffa6' }} as='h1'  align="center">
          <Icon style={{ color: '#00ffa6'}} name='sign in'/>
          <Header.Content>Sign In</Header.Content>
        </Header>

        <form className="ui large form" onSubmit={this.handleSubmit}>
          <div style={{ borderRadius: '44px', padding: '28px', border: '2px solid #0a0a0a'}} className="ui inverted segment">
            <div className="field"><div className="ui left icon input">
              <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} value={email} type="email"/><i style={{ color: '#00ffa6'}} className="mail icon" />
            </div></div>
            <div className="field"><div className="ui left icon input">
              <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} value={password} type="password"/><i style={{ color: '#00ffa6'}} className="lock icon" />
            </div></div>

            <Button disabled={loading} className={loading ? 'loading' : ''} circular size="large" style={{ color: 'black', backgroundColor: '#00ffa6'}}>Log In</Button>
          </div>
        </form>

        <Message style={{ borderRadius: '50px', background: '#0a0a0a', color: 'grey'}}><p>Don't have an account? <Link to="/register">Create</Link></p></Message>
      </Grid.Column>
    </Grid>
  )
}

}

export default Login;
