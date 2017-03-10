import React from 'react';
import {Grid, Row, Col, Jumbotron, PageHeader, Button, ButtonToolbar, Accordion, Panel} from 'react-bootstrap';
import PollDetails from './PollDetails.jsx';
import PollNew from './PollNew.jsx';

class PollList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items : props.items,
      showAll: true,
      showNew: false,
      loading: true
    };
    this.filterOn = this.filterOn.bind(this);
    this.filterOff = this.filterOff.bind(this);
    this.createPoll = this.createPoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
    this.voteForOption = this.voteForOption.bind(this);
  }

  componentDidMount() {
    var _this = this;
    fetch('/polls', {
      method: 'GET',
	    mode: 'cors',
	    headers: new Headers({
		      'Accept': 'application/json'
        }),
      credentials: 'same-origin'
    }).then(function(response) {
        return response.json();
    })
     .then(function(json) {
       _this.setState({
         items: json.polls,
         showAll: true,
         loading: false
       });
       if(!_this.authenticated) {
         _this.props.handleAnonymousUser(json.user);
       }
     });
  }

  filterOff() {
    var allPolls = this.state.items.map(i => {
       i.hide = false;
       return i;
    });
    this.setState({
      items: allPolls,
      showAll: true
    });
  }
  filterOn() {
    var myPolls = this.state.items.map(i => {
     i.hide = (i.owner && i.owner.id != this.props.user.id);
     return i;
    });
    this.setState({
      items: myPolls,
      showAll: false
    });
  }

  createPoll(newPoll) {
    var _this = this;
    console.log('create new Poll', newPoll);
    this.setState({loading: true});
    fetch(`/polls`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(newPoll)
      }).then(function(response) {
        // console.log('result from create poll', response.ok, response.status);
        if(response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }).then(function(item){
        // console.log('creation successfull', item);
        var newItems = _this.state.items.concat(item);
        // console.log('adding', item, newItems);
        _this.setState({
          items: newItems,
          showAll: true,
          showNew: false,
          loading: false
        });
        // console.log('state set');
      })
  }

  voteForOption(pollId) {
    var _this = this;
    return function(optionId) {
      console.log('voting for option', _this.props.user, pollId, optionId);
      _this.setState({loading: true});
      fetch(`/polls/${pollId}/options/${optionId}`, {
            method: 'POST',
            credentials: 'include',
        }).then(function(response) {
          if(response.ok) {
            // console.log('succesfully voted for option');
            response.json().then(function(item) {
              var myItems = _this.state.items.filter(i => i._id != item._id).concat(item);
              console.log('vote result', item, myItems);
              _this.setState({
                items: myItems,
                loading: false
              });
              console.log('done voting');
            })
          } else {
            console.error(_this.props.user, _this.items.find(i => i._id == pollId));
            throw new Error('voting failed, ' + response.statusText)
          }
        });
    }
  }
  deletePoll(pollId) {

    var _this = this;
    console.log('deleting poll', pollId);
    this.setState({loading: true});
    fetch(`/polls/${pollId}`, {
          method: 'DELETE',
          credentials: 'include'
      }).then(function(response) {
        // console.log('result from delete poll', response.ok, response.status);
        if(response.ok) {
          // console.log('sucessfully deleted', pollId);
          var updatedItems = _this.state.items.filter(i => i._id != pollId);
          _this.setState({
            items: updatedItems,
            loading: false
          });
          // console.log('delete done');
        } else {
          throw new Error(response.statusText);
        }
      })
  }

  render() {
    var {items, showAll, showNew, loading} = this.state;
    var {authenticated, user} = this.props;

console.log('rendering pollist', loading, user);
    var newHeading = <h2><i className="fa fa-plus-circle"></i> NEW</h2>;
    var buttons;
    if(authenticated ) {
      buttons = (<ButtonToolbar className="pull-right">
        <Button bsSize='small' bsStyle="primary" disabled onClick={this.filterOn}>only my polls</Button>
        <Button bsSize='small' bsStyle="success" onClick={this.filterOff}>all polls</Button>
      </ButtonToolbar>);
      if(showAll) {
        buttons = (<ButtonToolbar className="pull-right">
          <Button bsSize='small' bsStyle="primary" onClick={this.filterOn}>only my polls</Button>
          <Button bsSize='small' bsStyle="success" disabled onClick={this.filterOff}>all polls</Button>
        </ButtonToolbar>);
      }
    }
    function header(h) {
      return (<h2 className='title text-danger'>{h}</h2>);
    }
    var old = (  <Jumbotron>
        <h2>FCC - Voting App</h2>
        <p className="lead">Below are polls hosted.<br/>
        Select a poll to see the results and vote, or sign-in to make a new poll.</p>
        {buttons}
        </Jumbotron>);
    return (
      <div>
        {buttons}
        <PageHeader>FreeCodeCamp - Voting App</PageHeader>
        <p>Select a poll to see the results and vote, or sign-in to make a new poll.</p>
        <Accordion>
        { authenticated &&
          <Panel header={newHeading} bsStyle="success" eventKey="newPoll" key='newPoll' expanded={showNew}>
            <PollNew onCreate={this.createPoll}/>
          </Panel>
        }
          { loading ? <Panel header={<div className="text-center">Loading <i className="fa fa-spinner fa-4x"></i> Loading</div>} /> : items.filter(item => !item.hide).map( item =>
          <Panel header={header(item.poll.description)} eventKey={'poll' +item._id} key={'poll' +item._id}>
            <PollDetails poll={item.poll} votes={item.votes} id={item._id}
              authenticated={authenticated} owner={item.owner} user={user}
              onDelete={this.deletePoll} onVote={this.voteForOption(item._id)}/>
          </Panel>
          )}
        </Accordion>
      </div>
    );
  }
}
PollList.propTypes = {
  items: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.isRequired,
  handleAnonymousUser: React.PropTypes.func.isRequired
};
PollList.defaultProps = {
  handleAnonymousUser: function() {console.warn('no function defined to handle anonymouse user!!');},
  items: []
};

export default PollList;
