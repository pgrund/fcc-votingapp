import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col} from 'react-bootstrap';
import MyNav from './MyNav.jsx';
import PollList from './PollList.jsx';
import LoginForm from './LoginForm.jsx';
import ProfileForm from './ProfileForm.jsx';

class VoteApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: {},
      errors: {},
      show: {
        login: false,
        profile: false
      },
      single: props.single ? props.single.split('=')[1] : ''
    };
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.setAnonymousUser = this.setAnonymousUser.bind(this);
  }

  setAnonymousUser(user) {
    if(!this.state.authenticated) {
      console.log('setting anonymous user', user);
      this.setState({user: user});
    }
  }
  loginHandler( user ) {
    const _this = this;
    const login = Object.keys(user).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(user[key]);
    }).join('&');
    fetch(`/auth/local`, {
          method: 'POST',
          headers: {
             'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          credentials: 'same-origin',
          body: login
      }).then(function(response) {
        return response.json();
      }).then(function(loggedInUser){
        console.log('auth successfull', loggedInUser);
        _this.setState({
          authenticated: true,
          user: loggedInUser,
          show: {
            login: false
          }
        });
      })
  }

  logoutHandler(){
    this.setState({
      authenticated: false,
      user: {}
    });
    console.log('logged out');
  }


  render() {
    var {authenticated, user, errors} = this.state;
    return (
      <Grid fluid>
        <MyNav authenticated={authenticated} user={user}
          onLogin={() => {this.setState({show : {login: true}});}}
          onProfile={() => {this.setState({show : {profile: true}});}}
          onLogout={this.logoutHandler}/>
        <PollList authenticated={authenticated} user={user}
          handleAnonymousUser={this.setAnonymousUser} selected={this.state.single}/>
        <LoginForm user={user} errors={errors}
          handleClose={() => {this.setState({show : {login: false}});}}
          visible={this.state.show.login}
          handleAuthByLocal={this.loginHandler}/>
        {authenticated && <ProfileForm user={user} visible={this.state.show.profile}
          handleClose={() => {this.setState({show: {profile: false}})}}/> }
      </Grid>
    );
  }
}

ReactDOM.render(
  <VoteApp single={window.location.search.substring(1)}/>,
  document.getElementById('app')
);
