
// set the dimensions and margins of the graph
var margin2 = {top: 10, right: 10, bottom: 10, left: 10},
width2 = 900 - margin2.left - margin2.right,
height2 = 600 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var chart2 = d3.select("#tree")
.append("svg")
.attr("width", width2 + margin2.left + margin2.right)
.attr("height", height2 + margin2.top + margin2.bottom)
.append("g")
.attr("transform",
    "translate(" + margin2.left + "," + margin2.top+ ")");

// Read data
d3.csv('https://github.com/ocalvoa/VisualitzacioDades/tree/master/Data/tree.csv', function(data) {
// stratify the data: reformatting for d3.js
var anidados = d3.nest()
            .key(function(d){return d.Region;})
            .key(function(d){return d.Country;})
            .rollup(function(leaves) { return leaves.length; })
            .entries(data);

// Give the data to this cluster layout:
  var root = d3.hierarchy({values: anidados}, function(d) { return d.values; })
          .sum(function(d) { return d.value; })
          .sort(function(a, b) { return b.value - a.value; });
//console.log(root)
// Then d3.treemap computes the position of each element of the hierarchy
// The coordinates are added to the root object above
d3.treemap()
.size([width2, height2])
.padding(8)
(root)

//console.log(root.leaves())

// prepare a color scale
  var color = d3.scaleOrdinal()
    .domain(["Africa (excl MENA)","Americas","Asia and Pacific","Cross-regional","Europe and Eurasia", "Middle East and North Africa"])
    //.domain(Array.from(new Set(data.Region)))
    .range(d3.schemeSet2)

// use this information to add rectangles:
chart2
.selectAll("rect")
.data(root.leaves())
.enter()
.append("rect")
  .attr('x', function (d) { return d.x0; })
  .attr('y', function (d) { return d.y0; })
  .attr('width', function (d) { return d.x1 - d.x0; })
  .attr('height', function (d) { return d.y1 - d.y0; })
  .style("stroke", "black")
  .style("fill", function(d){ return color(d.parent.data.key)} );

// and to add the text labels
chart2
.selectAll("text")
.data(root.leaves())
.enter()
.append("text")
  .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
  .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
  .text(function(d){ return d.data.key})
  .attr("font-size", "15px")
  .attr("fill", "white")

  // Add title for the groups
 chart2
   .selectAll("titles")
   .data(root.descendants().filter(function(d){return d.depth==1}))
   .enter()
   .append("text")
     .attr("x", function(d){ return d.x0+10})
     .attr("y", function(d){ return d.y0+5})
     .text(function(d){ return d.data.key })
     .attr("font-size", "12px")
     .attr("fill","black" )
//console.log(root.descendants().filter(function(d){return d.depth==1}))
})
