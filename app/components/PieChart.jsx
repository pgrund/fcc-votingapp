import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3"

class PieChart extends React.Component {

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    var { width, height } = this.props;
    var radius = Math.min(width, height) / 2;

    console.log(el, this.props);


    var svg = d3.select(el).append("svg")
      .attr('width', width)
      .attr('height', height);

    var {votes} = this.props;

    svg.select('.chartLayer').remove();

    var data = d3.nest().key(d => d.option).entries(votes);

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
  }

  componentWillUnmount() {
      var el = ReactDOM.findDOMNode(this);
      $(el).find('.chartLayer').remove();
  }

  render() {
    return (
      <div id="piechart"></div>
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
