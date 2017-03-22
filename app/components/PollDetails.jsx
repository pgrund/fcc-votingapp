import React from 'react';
import PieChart from './PieChart.jsx';
import {Grid, Row, Col, Clearfix, FormGroup, FormControl, InputGroup, Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';

class PollDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      option: {}
    };
  }
  render() {
    var {owner, poll, votes, user,  id, authenticated,
      onDelete, onEdit, onVote, onAddOption} = this.props;

    var alreadyVoted = (votes && votes.find(v => v.user == user.username));
    var editable = (owner && owner.id == user.id);

    function optionButton(o, idx) {
      var option = votes.filter(v => v.option == o._id);
      var btn = <Button bsStyle='primary' onClick={() => {onVote(o._id)}}>{o.name}</Button>;
      if(alreadyVoted) {
        btn = <Button bsStyle='default' disabled className={alreadyVoted.option == o._id  ? ' focus' : ''}>{o.name}</Button>;
      }
      return (
        <Col key={o._id} xs={12} className='btn-option'>
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
                  <ButtonToolbar>
                    { editable &&
                    <ButtonGroup className="pull-right">
                      <Button bsStyle="danger" onClick={() => { onDelete(id)}}><i className="fa fa-trash"></i> delete</Button>
                      <Button bsStyle="warning" onClick={() => { onEdit(id)}}><i className="fa fa-pencil"></i> edit</Button>
                    </ButtonGroup>
                    }
                    { authenticated &&
                      <ButtonGroup className="pull-right">
                        <Button bsStyle="primary" href={`mailto:?subject=check this vote&body=Hi,\ncheck out this awesome vote at ${window.location.href.split('?')[0]}?select=${id}`}><i className="fa fa-mail"></i> share poll</Button>
                      </ButtonGroup>
                    }
                  </ButtonToolbar>
                  <h2 className="title">{poll.description}</h2>
                </Col>
                <Col xs={12} smOffset={2} sm={10}>
                  <Row>
                    <Col xs={12}>
                      <p>{alreadyVoted ? 'I voted for ...' : 'I\'d like to vote for ...'}</p>
                      { authenticated &&
                      <FormGroup className="pull-right">
                        <InputGroup>
                          <FormControl type="text" onChange={(evt) => {this.setState({option: evt.target.value});}}/>
                          <InputGroup.Button>
                            <Button bsStyle="success" onClick={(evt) => { onAddOption(id, this.state.option)}}>add option</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                      }
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
                 return v})}
                 showTable={authenticated && editable} />
            </Col>
          </Row>
        </Grid>
    );
  }
}
PollDetails.propTypes = {
  authenticated: React.PropTypes.bool.isRequired,
  owner: React.PropTypes.object.isRequired,
  poll : React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onEdit: React.PropTypes.func.isRequired,
  onVote: React.PropTypes.func.isRequired,
  onAddOption: React.PropTypes.func.isRequired
};
PollDetails.defaultProps = {
  authenticated: false,
  onDelete: function(id) {console.log('no function defined for deleting a poll!!', id);},
  onEdit: function(id) {console.log('no function defined for editing a poll!!', id);},
  onVote: function(id) {console.log('no function defined for voting for an option!!', id);},
  onAddOption: function(id, option) {console.log('no function defined for adding an option!!', id, option);}
};

export default PollDetails;
