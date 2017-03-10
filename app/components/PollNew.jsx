import React from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

class PollNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      poll: {
        description: '',
        options: []
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const field = event.target.name;
    const poll = this.state.poll;
    if(field == 'options') {
      var test = event.target.value.split('\n') // split up
          .map(o => o.trim()) // remove leading and trailing spaces
          .filter(o => o.length > 0) // only no null values
          .map(o => { return {   // map to right options object
              key: o.replace(/[\s\.-]/g,'_'), // handle special chars
              name: o
            };
          });
        console.log('textarea input', test);
        poll['options'] = test;
    } else {
      poll[field] = event.target.value;
    }
    this.setState({
      poll: poll
    });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onCreate(this.state.poll);
    this.setState({ poll: {}});
  }
  render() {
    return (
      <div>
        <Form>
          <FormGroup controlId="newDescription">
            <ControlLabel>Description</ControlLabel>
            <FormControl type="text" name="description" placeholder="Description" onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup controlId="newOptions">
            <ControlLabel>Available Options</ControlLabel>
            <FormControl componentClass="textarea" name="options" placeholder="one option per line ... " rows={5} onChange={this.handleChange}/>
          </FormGroup>
        </Form>
        <Button bsStyle='primary' onClick={this.handleSubmit}>submit</Button>
      </div>
    );
  }
}
PollNew.propTypes = {
  onCreate: React.PropTypes.func.isRequired
};
PollNew.defaultProps = {
  onCreate: function(poll) { console.warn('no function defined to handle new poll!!',poll);}
};

export default PollNew;
