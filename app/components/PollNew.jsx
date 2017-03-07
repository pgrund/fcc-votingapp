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
      poll[field] = event.target.value.split(',') // split up
          .map(o => o.trim()) // remove leading and trailing spaces
          .filter(o => o.length > 0) // only no null values
          .map(o => { return {   // map to right options object
              key: o.replace(/[\s\.-]/g,'_'), // handle special chars
              name: o
            };
          })
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
            <FormControl type="text" name="options" placeholder="Multiple options seperated by coma ..." onChange={this.handleChange}/>
          </FormGroup>
        </Form>
        <Button onClick={this.handleSubmit}>submit</Button>
      </div>
    );
    var old = (
      <form className="col-xs-12 col-sm-offset-2 col-sm-4 row">
         <div className="form-group">
           <label>Description</label>
           <input type="text" className="form-control" id="newDescription" name="description" placeholder="Description" onChange={this.handleChange}/>
         </div>
         <div className="form-group">
           <label>Available Options</label>
           <input type="text" className="form-control" id="newOptions" name="options" placeholder="Multiple Options, seperated by coma ..." onChange={this.handleChange}/>
         </div>
         <button className="btn btn-new btn-default" onClick={this.handleSubmit}>Submit</button>
     </form>
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
