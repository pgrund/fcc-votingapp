import React from 'react';
import {Panel} from 'react-bootstrap';

class PollNew extends React.Component {
  render() {
    return (
      <form className="col-xs-12 col-sm-offset-2 col-sm-4 row" method="post" action="/polls">
         <div className="form-group">
           <label>Description</label>
           <input type="text" className="form-control" id="newDescription" name="description" placeholder="Description" />
         </div>
         <div className="form-group">
           <label>Available Options</label>
           <input type="text" className="form-control" id="newOptions" name="options" placeholder="Multiple Options, seperated by coma ..." />
         </div>
         <button type="submit" className="btn btn-new btn-default">Submit</button>
     </form>
    );
  }
}
PollNew.propTypes = {};
PollNew.defaultProps = {};

export default PollNew;
