import React from 'react';
import PieChart from './PieChart.jsx';
import {Grid, Row, Col, Button, ButtonGroup} from 'react-bootstrap';

class PollDetails extends React.Component {
  render() {
    var {editable, poll, votes, user, onDelete, onEdit, onVote, id} = this.props;

    var alreadyVoted = (votes && votes.find(v => v.user == user.username));

    function optionButton(o, idx) {
      var option = votes.filter(v => v.option == o._id);
      if(o.name=='e') {
        console.log('option testing', o, option, user);
      }
      var btn = <Button bsStyle='primary' onClick={() => {onVote(o._id)}}>{o.name}</Button>;
      if(alreadyVoted) {
        btn = <Button bsStyle='default' disabled className={alreadyVoted.option == o._id  ? ' focus' : ''}>{o.name}</Button>;
      }
      return (
        <Col key={o._id} xs={12} sm={4} className='btn-option'>
          {btn}
        </Col>
      );
    }
    return (
        <Grid>
          <Row>
            <Col xs={12} smOffset={1} sm={5}>
              <Row>
                <Col xs={12}>
                  { editable &&
                  <ButtonGroup className="pull-right">
                    <Button bsStyle="danger" onClick={() => { onDelete(id)}}><i className="fa fa-trash"></i>delete</Button>
                    <Button bsStyle="warning" onClick={() => { onEdit(id)}}><i className="fa fa-pencil"></i>edit</Button>
                  </ButtonGroup>
                  }
                  <h2 className="title">{poll.description}</h2>
                </Col>
                <Col xs={12} smOffset={2} sm={10}>
                  <Row>
                    <Col xs={12}>
                      <p>{alreadyVoted ? 'I voted for ...' : 'I\'d like to vote for ...'}</p>
                    </Col>
                    <Col xs={12}>
                      <Row>
                      { poll.options.map( optionButton )}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6}>
              <PieChart votes={votes.map(v => {
                 v.name = poll.options.find(o => o._id == v.option).name;
                 return v})}/>
            </Col>
          </Row>
        </Grid>
    );
  }
}
PollDetails.propTypes = {
  editable: React.PropTypes.bool.isRequired,
  poll : React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onEdit: React.PropTypes.func.isRequired,
  onVote: React.PropTypes.func.isRequired
};
PollDetails.defaultProps = {
  editable: false,
  onDelete: function(id) {console.log('no function defined for deleting a poll!!', id);},
  onEdit: function(id) {console.log('no function defined for editing a poll!!', id);},
  onVote: function(id) {console.log('no function defined for voting for an option!!', id);}
};

export default PollDetails;
