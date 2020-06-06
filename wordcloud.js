// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var chart4 = d3.select("#word_cloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(350,250)");

var a = d3.csv("./Data/wc.csv", function(data) {
  // List of groups (here I have one group per column)
  var allGroup =["Africa (excl MENA)","Americas","Asia and Pacific","Cross-regional","Europe and Eurasia", "Middle East and North Africa"];

  update_wordcloud("Africa (excl MENA)")
  myWords = data.filter(function(d){return d.region=="Africa (excl MENA)"})
  delete myWords.region
  // Initialize line with first group of the list
      var line = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function(d) { return {text: d.word, size:d.freq}; }))
        .padding(10)        //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw)
        .start();

  //console.log(myWords)
  //console.log(allGroup)
  d3.select("#drop")
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

    function update_wordcloud(selectedGroup) {

      myWords = data.filter(function(d){return d.region==selectedGroup})
      delete myWords.region

      d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function(d) { return {text: d.word, size:d.freq}; }))
        .padding(10)        //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw)
        .start();

    }

    function draw(words) {
      var cloud = chart4.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", "#0080d9")
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }



  // When the button is changed, run the updateChart function
  d3.select("#drop").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption1 = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update_wordcloud(selectedOption1)
  })
});
