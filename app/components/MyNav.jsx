import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class MyNav extends React.Component {

  render() {
    return (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">FreeCodeCamp - Voting App</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey='nav1' href="#">Home</NavItem>
              { this.props.authenticated && <NavItem eventKey='nav3' href="#" onClick={() => alert(JSON.stringify(this.props.user, null, ' '))}>Profile</NavItem> }
            </Nav>
            <Nav pullRight>
              { !this.props.authenticated && <NavItem eventKey='nav2' href="#" onClick={this.props.onLogin}>Login</NavItem> }
              { this.props.authenticated && <NavItem eventKey='nav4' href="#" onClick={this.props.onLogout}>Logout</NavItem> }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}
MyNav.propTypes = {
  authenticated: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object,
  onLogin: React.PropTypes.func.isRequired,
  onLogout: React.PropTypes.func.isRequired
};
MyNav.defaultProps = {
  authenticated: false,
  onLogin: function() {console.warn('no login function defined !!')},
  onLogout: function() {console.warn('no login function defined !!')}
};

export default MyNav;
