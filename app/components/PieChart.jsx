import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3"

class PieChart extends React.Component {

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    var { width, height } = this.props;
    var radius = Math.min(width, height) / 2;

    var svg = d3.select(el).append("svg")
      .attr('width', width)
      .attr('height', height);

    var {votes} = this.props;

    svg.select('.chartLayer').remove();

    var data = d3.nest().key(d => d.name).entries(votes);

    var chartLayer = svg.append("g").classed("chartLayer", true)
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arcs = d3.pie()
         .sort(null)
         .value(function(d) { return d.values.length; })
         (data)


     var arc = d3.arc()
         .outerRadius(height/2)
         .innerRadius(height/4)
         .padAngle(0.03)
         .cornerRadius(8)

     var pieG = chartLayer.selectAll("g")
         .data([data])
         .enter()
         .append("g")
         .attr("transform", "translate("+[width/2, height/2]+")")

     var block = pieG.selectAll(".arc")
         .data(arcs)

     var newBlock = block.enter().append("g").classed("arc", true)


     newBlock.append("path")
         .attr("d", arc)
         .attr("id", function(d, i) { return "arc-" + i })
         .attr("stroke", "gray")
         .attr("fill", function(d,i){ return color(i); })
     newBlock.append("text")
         .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
         .attr("dy", ".35em")
         .text(function(d) {return d.data.key;});
  }

  componentWillUnmount() {
      var el = ReactDOM.findDOMNode(this);
      d3.select(el).select('.chartLayer').remove();
  }

  render() {
    return (
      <div id="piechart">
      { this.props.votes.length == 0 && <p className="lead">no votes yet</p>}
      </div>
    );
  }
}
PieChart.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  votes: React.PropTypes.array.isRequired,
};
PieChart.defaultProps = {
  width: 480,
  height: 300,
  votes: []
};

export default PieChart;
