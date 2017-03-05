import React from 'react';
import {Grid, Row, Col, Jumbotron, Button, ButtonToolbar, Accordion, Panel} from 'react-bootstrap';
import PollDetails from './PollDetails.jsx';
import PollNew from './PollNew.jsx';

class PollList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items : props.items
    };
    this.filterOn = this.filterOn.bind(this);
    this.filterOff = this.filterOff.bind(this);
  }

  filterOff() {
    this.setState({
      items: this.props.items
    });
  }
  filterOn() {
    var myPolls = this.state.items.filter(i => i.owner.id == this.props.user.id);
    this.setState({
      items: myPolls
    });
  }

  render() {
    var {items} = this.state;
    var {authenticated, user} = this.props;

    var newHeading = <span><i className="fa fa-plus-circle"></i> NEW</span>;

    console.log(items);

    var buttons;
    if(authenticated ) {
      var onlyOwnFilter = items.every(item => item.owner.id == user.id);

      buttons = (<ButtonToolbar>
        <Button bsSize='small' bsStyle="primary" className={!onlyOwnFilter && 'disabled'} onClick={this.filterOn}>only my polls</Button>
        <Button bsSize='small' bsStyle="success" className={onlyOwnFilter && 'disabled'} onClick={this.filterOff}>all polls</Button>
      </ButtonToolbar>);
    }
    return (
      <div>
        <Jumbotron>
          <h2>FCC - Voting App</h2>
          <p className="lead">Below are polls hosted.<br/>
          Select a poll to see the results and vote, or sign-in to make a new poll.</p>
          {buttons}
          </Jumbotron>
        <Accordion>
          <Panel header={newHeading} bsStyle="success" eventKey="newPoll" key='newPoll'>
            <PollNew />
          </Panel>
          { items.map( item =>
          <Panel header={item.poll.description} eventKey={'poll' +item._id} key={'poll' +item._id}>
            <PollDetails poll={item.poll} votes={item.votes} id={item._id} editable={authenticated && item.owner.id == user.id} user={user}/>
          </Panel>
          )}
        </Accordion>
      </div>
    );
  }
}
PollList.propTypes = {
  items: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.isRequired
};
PollList.defaultProps = {
  items: [{
    _id: '1234',
    poll: {
      description: 'test',
      options: [{
        _id: '1',
        key: 'a',
        name: 'option a'
      },
      {
        _id: '2',
        key: 'b',
        name: 'option b'
      },
      {
        _id: '3',
        key: 'c',
        name: 'option c'
      },
      {
        _id: '4',
        key: 'd',
        name: 'option d'
      }],
      votes: [
        {
          option: '1',
          user: 'user-a'
        },
        {
          option: '2',
          user: 'user-b'
        }
      ]
    },
    owner: {
      id: 'b',
      name: 'user-b'
    }
  }]
};

export default PollList;
