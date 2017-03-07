import React from 'react';
import {Grid, Row, Col,
   ButtonToolbar, Button,
   ControlLabel,
   Modal} from 'react-bootstrap';

const ProfileForm = ({
  handleClose,
  visible,
  user}) => (
    <Modal show={visible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
               <Col componentClass={ControlLabel} sm={2}>
                ID
               </Col>
               <Col sm={10}>
                {user.id}
               </Col>
            </Row>
            <Row>
               <Col componentClass={ControlLabel} sm={2}>
                User Name
               </Col>
               <Col sm={10}>
                {user.username}
               </Col>
            </Row>
            <Row>
               <Col componentClass={ControlLabel} sm={2}>
                Display Name
               </Col>
               <Col sm={10}>
                {user.displayName}
               </Col>
            </Row>
           </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );

ProfileForm.propTypes = {
  handleClose: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  visible: React.PropTypes.bool.isRequired
};
ProfileForm.defaultProps = {
  visible: false,
}

export default ProfileForm;
