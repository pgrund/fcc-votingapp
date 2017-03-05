import React from 'react';
import ReactDOM from 'react-dom';
import MyNav from './MyNav.jsx';
import PollList from './PollList.jsx';

class VoteApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: {}
    };
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  loginHandler() {
    this.setState({
      authenticated: true,
      user: {
        id: 'a',
        name: 'user-a'
      }
    });
    console.log('logged in');
  }

  logoutHandler(){
    this.setState({
      authenticated: false,
      user: {}
    });
    console.log('logged out');
  }

  render() {
    var {authenticated,user} = this.state;
    return (
      <div className="container-fluid">
        <MyNav authenticated={authenticated} user={user}
          onLogin={this.loginHandler} onLogout={this.logoutHandler}/>
        <PollList authenticated={authenticated} user={user}/>
      </div>
    );
  }
}

ReactDOM.render(
  <VoteApp />,
  document.getElementById('app')
);
