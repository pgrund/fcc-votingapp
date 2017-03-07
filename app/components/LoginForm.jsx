import React from 'react';
import {Grid, Row, Col,
   ButtonToolbar, Button,
   Form, FormGroup, FormControl, ControlLabel,
   Modal} from 'react-bootstrap';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user : {},
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user: user
    });
  }

  render() {
    const {visible, handleClose,
      handleAuthByGithub, handleAuthByFacebook, handleAuthByTwitter,
      handleAuthByLocal} = this.props;

    return (
      <Modal show={visible} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Login via ...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ButtonToolbar>
              <Button className="btn-gh" onClick={handleAuthByGithub}>
                <i className="fa fa-github"></i> Github
              </Button>
              <Button className="btn-fb" onClick={handleAuthByFacebook}>
                <i className="fa fa-facebook"></i> Facebook
              </Button>
              <Button className="btn-tw" onClick={handleAuthByTwitter}>
                <i className="fa fa-twitter"></i> Twitter
              </Button>
            </ButtonToolbar>
            <p>or</p>
            <Form>
              <FormGroup controlId="formInlineName">
                 <ControlLabel>User Name</ControlLabel>
                 <FormControl type="text" name="username" placeholder="User Name" onChange={this.handleChange}/>
               </FormGroup>
               <FormGroup controlId="formInlinePassword">
                 <ControlLabel>Password</ControlLabel>
                 <FormControl type="password" name="password" placeholder="your pass ..." onChange={this.handleChange}/>
               </FormGroup>
             </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => handleAuthByLocal(this.state.user)}>Login</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
LoginForm.propTypes = {
  handleAuthByGithub: React.PropTypes.func.isRequired,
  handleAuthByFacebook: React.PropTypes.func.isRequired,
  handleAuthByTwitter: React.PropTypes.func.isRequired,
  handleAuthByLocal: React.PropTypes.func.isRequired,
  handleClose: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  visible: React.PropTypes.bool.isRequired
};
LoginForm.defaultProps = {
  visible: false,
  handleAuthByGithub: function() { console.warn('no function bind to auth via Github !!!')},
  handleAuthByFacebook: function() { console.warn('no function bind to auth via Facebook !!!')},
  handleAuthByTwitter: function() { console.warn('no function bind to auth via Twitter !!!')},
  handleAuthByLocal: function() { console.warn('no function bind to auth via local Authentication !!!')}
}

export default LoginForm;
