import React from 'react';
import PieChart from './PieChart.jsx';
import {Grid, Row, Col, Button, ButtonGroup} from 'react-bootstrap';

class PollDetails extends React.Component {
  render() {
    var {editable, poll, user} = this.props;

    var alreadyVoted = poll.votes.find(v => v.user == user.name);

    function optionButton(o, idx) {
      console.log(o, idx, alreadyVoted);
      var btn = <Button bsStyle='primary'>{o.name}</Button>;
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
                    <Button bsStyle="danger"><i className="fa fa-trash"></i>delete</Button>
                    <Button bsStyle="warning"><i className="fa fa-pencil"></i>edit</Button>
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
              <PieChart votes={poll.votes}/>
            </Col>
          </Row>
        </Grid>
    );
  }
}
PollDetails.propTypes = {
  editable: React.PropTypes.bool.isRequired,
  poll : React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};
PollDetails.defaultProps = {
  editable: false
};

export default PollDetails;
