// set the dimensions and margins of the graph
var margin1 = {top: 10, right: 30, bottom: 30, left: 60},
    width1 = 900 - margin1.left - margin1.right,
    height1 = 600 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
var chart1 = d3.select("#line_filter")
  .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");

//Read the data
d3.csv("./Data/densitat.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.regio)}).keys()
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, width1 ]);
    chart1.append("g")
      .attr("transform", "translate(0," + height1+ ")")
      //.attr("transform", "translate(0," + height+ ")")
      .call(d3.axisBottom(x).ticks(7));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.x; })])
      .range([ height1, 0 ]);
    chart1.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    var line = chart1
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.regio==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(+d.x) })
        )
        .attr("stroke", function(d){ return myColor("Africa (excl MENA)") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update_line(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.regio==selectedGroup})
      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(+d.x) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption1 = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_line(selectedOption1)
    })

})
