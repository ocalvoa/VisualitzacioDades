// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 900 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var chart3 = d3.select("#heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
// Region
var myGroups = ["Africa (excl MENA)","Americas","Asia and Pacific","Cross-regional","Europe and Eurasia", "Middle East and North Africa"]
// GRe
var myVars = [0, 1, 2, 3]
var dic = {
  0:"no es mencionen grups religiosos",
  1:"es mencionen grups religiosos",
  2:"s'inclouen clausules detallades sobre grups religiosos",
  3:"l'acord tracta sobre grups religiosos"
}
// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
chart3.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
chart3.append("g")
  .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#0080d9"])
  //.range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
d3.csv("./Data/heatmap.csv", function(data) {
  // create a tooltip
  var tooltip = d3.select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip.style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.freq+" vegades "+dic[d.GRe])
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip.style("opacity", 0)
  }
  // add the squares
  chart3.selectAll()
    .data(data, function(d) {return d.Region+':'+d.GRe;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Region) })
      .attr("y", function(d) { return y(d.GRe) })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return myColor(d.freq)} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})
