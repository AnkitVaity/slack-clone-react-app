import React from 'react';
import { Grid, Form, Input, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import swal from 'sweetalert';
import './sweetAlert.css';
// We will using md5 to create a unique value to provide it to the gravatar.com URL
// md5 returns hash messages
import md5 from 'md5';

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: '',
    loading: false,
    usersRef: firebase.database().ref('users')
  };

//------------------------------------------------------------------------------
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value})
  };
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // throw error
      error = { message: "Fill in all the fields"};
      this.setState({ errors: errors.concat(error) });
      swal(error.message,{
        icon: "error",
        timer: 1500,
        buttons: false
      });
      return false;
    } else if (this.isPasswordValid(this.state)) {
      // throw error
      error = { message: "Password is invalid"};
      this.setState({ errors: errors.concat(error) });
      swal(error.message,{
        icon: "error",
        timer: 1500,
        buttons: false
      });
    } else {
      swal("Registration completed successfully",{
        icon: "info",
        timer: 1500,
        buttons: false
      });
      // Form is valid
      return true;
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if ( password.length < 6 || passwordConfirmation.length < 6) {
      return true;
    } else if (password !== passwordConfirmation) {
      return true;
    } else {
      return false;
    }
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  saveUser = createUser => {
    // This function will save users that we are registering to our firebase database
    return this.state.usersRef.child(createUser.user.uid).set({
      name: createUser.user.displayName,
      avatar: createUser.user.photoURL
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // Form Validation
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true});

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log('user saved');
            })
          })
          .catch(err => {
            console.error(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false });
          })
        })
        .catch(err => {
          console.error(err);
          this.setState({ errors: this.state.errors.concat(err), loading: false });
        });
    }

  };
  //----------------------------------------------------------------------------

  // handleInputError will give a red border to the error field
  // I failed to implement this
  // handleInputError = (errors, inputName) => {
  //   return errors.message.some(error =>
  //     error.message.toLowerCase().includes(inputName)
  //   )
  //   ? "error"
  //   : ""
  // }

  //----------------------------------------------------------------------------

  render() {

    // Destructuring state object
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 400 }}>
          <Header style={{ marginBottom: "30px", color: "#00ffa6" }} as='h1'  align="center">
            <Icon style={{ color: '#00ffa6' }} name='edit outline'/>
            <Header.Content>Sign Up</Header.Content>
          </Header>

          <form className="ui large form" onSubmit={this.handleSubmit}>
            <div style={{ borderRadius: '44px', padding: '28px', border: '2px solid #0a0a0a'}} className="ui inverted segment">
              <div className="field"><div className="ui left icon input">
                <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.handleChange} value={username} type="text"/><i style={{ color: '#00ffa6' }} className=" user icon" />
              </div></div>
              <div className="field"><div className="ui left icon input">
                <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} value={email} type="email"/><i style={{ color: '#00ffa6' }} className=" mail icon" />
              </div></div>
              <div className="field"><div className="ui left icon input">
                <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} value={password} type="password"/><i style={{ color: '#00ffa6' }} className=" lock icon" />
              </div></div>
              <div className="field"><div className="ui left icon input">
                <input style={{ borderRadius: '50px', backgroundColor: 'black', color: 'grey'}} fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" value={passwordConfirmation} onChange={this.handleChange} type="password"/><i style={{ color: '#00ffa6' }} className=" repeat icon" />
              </div></div>

              <Button disabled={loading} className={loading ? 'loading' : ''} circular size="large" style={{ color: 'black', backgroundColor: '#00ffa6'}}>Create Account</Button>
            </div>
          </form>

          <Message style={{ borderRadius: '50px', background: '#0a0a0a', color: 'grey'}}><p>Already a user? <Link to="/login">Login</Link></p></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register;
