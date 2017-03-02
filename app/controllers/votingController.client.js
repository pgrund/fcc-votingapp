'use strict';

$(function() {
    var pollHeader = $('h2.title');
    var selectBox = $('select:first');
    var voteButton = $('button.btn-vote');

    var poll = {};

    // add data via ajax call
    $.get({
      url: window.location,
      dataType: 'json'
    }, function(result){
        poll = result[0];

        pollHeader.html(poll.poll.description);
        pollHeader.data('id', poll._id);

        selectBox.html(poll.poll.options.map( o => `<option value="${o._id}" key="${o.key}">${o.name}</option>`).join('\n'));


        var data = d3.nest().key(d => d.option).entries(poll.votes);

        var width = 480,
          height = 300,
          radius = Math.min(width, height) / 2;

        var svg = d3.select("#piechart").append("svg")
          .attr('width', width)
          .attr('height', height);
        var chartLayer = svg.append("g").classed("chartLayer", true)

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
             .attr("fill", function(d,i){ return d3.interpolateCool(Math.random()) })


         newBlock.append("text")
             .attr("dx", 55)
             .attr("dy", -5)
             .append("textPath")
             .attr("xlink:href", function(d, i) { return "#arc-" + i; })
             .text(function(d) { console.log(d);return d.key })
    });

    // event listeners
    voteButton.on('click', function(event) {
      console.log('vote for ', poll._id, selectBox.val());
      $.post(`/polls/${poll._id}/options/${selectBox.val()}`)
        .done(function(data, textStatus, jqXHR) {
          console.log('sucess!');
          poll = data;
        }).fail(function(jqXHR, textStatus, errorThrown) {
          var errMsg = JSON.parse(jqXHR.responseText);
          alert('Already voted!')
        });
    })
});
