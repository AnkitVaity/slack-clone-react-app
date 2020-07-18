import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';
import rootReducer from './reducers/index';
import { setUser, clearUser } from './actions/index';
import Spinner from './Spinner';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';

// Now we will setup the global state management system with Redux
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// rootReducer  is defined in reducers/index
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    console.log("Index Is Loading",this.props.isLoading);
    // This is a listner that detects if we have a user in our app
    firebase.auth().onAuthStateChanged(user => {
      // If it detects user app will redirect to the App page
      if (user) {
        console.log('Redirected logged in User', user);
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('/login');
        // This will clear our user from global state
        this.props.clearUser();
      }
    })
  }

   render() {
     // If this.props.isLoading is true we will show a spinner component
      return this.props.isLoading ? <Spinner /> : (
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});


// WithRouter will help us to redirect loggedin user to App page
const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

// To provide the store to all of our components we will use Provider component
ReactDOM.render(<Provider store={store}><Router><RootWithAuth /></Router></Provider>, document.getElementById('root'));
