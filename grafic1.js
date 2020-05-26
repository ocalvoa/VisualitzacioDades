    var width = 800,
        height = 600;

    var format = d3.format(",d");
    console.log("AQUÍ")

    var color = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

    var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true);

    d3.csv("PEC0_20152.csv", function(error, data) {

      if (error) throw error;

      var anidados = d3.nest()
          .key(function(d){return d.Perfil;})
          .key(function(d){return d.Sector;})
          .rollup(function(leaves) { return leaves.length; })
          .entries(data);

      var root = d3.hierarchy({values: anidados}, function(d) { return d.values; })
          .sum(function(d) { return d.value; })
          .sort(function(a, b) { return b.value - a.value; });

      treemap(root);

      var offsets = document.getElementById('vis').getBoundingClientRect();
      var div_top = offsets.top  + window.pageYOffset;
      var div_left = offsets.left + window.pageXOffset;

      var node = d3.select("#vis")
          .selectAll(".node")
          .data(root.leaves())
          .enter().append("div")
          .attr("class", "node")
          .style("left", function(d) { return div_left + d.x0 + "px"; })
          .style("top", function(d) { return div_top + d.y0 + "px"; })
          .style("width", function(d) { return d.x1 - d.x0 + "px"; })
          .style("height", function(d) { return d.y1 - d.y0 + "px"; })
          .style("background", function(d) { return color(d.parent.data.key); })
          .attr("title",function(d){ return d.parent.data.key; });

      node.append("div")
          .attr("class", "node-label")
          .text(function(d) { return d.data.key; });

      node.append("div")
          .attr("class", "node-value")
          .text(function(d) { return format(d.value); });

    });
