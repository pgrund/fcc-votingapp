import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

const MyNav = ({ authenticated, onProfile, onLogin, onLogout }) => (
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
              { authenticated && <NavItem eventKey='nav3' href="#" onClick={onProfile}>Profile</NavItem> }
            </Nav>
            <Nav pullRight>
              { authenticated ? <NavItem eventKey='nav4' href="/logout" onClick={onLogout}>Logout</NavItem> : <NavItem eventKey='nav2' href="#" onClick={onLogin}>Login</NavItem> }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );

MyNav.propTypes = {
  authenticated: React.PropTypes.bool.isRequired,
  onLogin: React.PropTypes.func.isRequired,
  onLogout: React.PropTypes.func.isRequired,
  onProfile: React.PropTypes.func.isRequired
};
MyNav.defaultProps = {
  authenticated: false,
  onLogin: function() {console.warn('no login function defined !!')},
  onLogout: function() {console.warn('no login function defined !!')},
  onProfile: function() {console.warn('no function defined to show profile !!');}
};

export default MyNav;
