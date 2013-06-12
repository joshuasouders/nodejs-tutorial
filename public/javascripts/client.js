var margin = {top: 20, right: 20, bottom: 120, left: 80},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 1);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/request", function(error, data) {

	data.forEach(function(d) {
		d.population2011 = +d.population2011;
	});

	x.domain(data.map(function(d) { return d.county; }));
	y.domain([0, d3.max(data, function(d) { return d.population2011; })]);

	svg.append("g")
		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
       		.call(xAxis)
        	.selectAll("text")  
            	.style("text-anchor", "end")
            	.attr("dx", "-.8em")
            	.attr("dy", ".15em")
            	.attr("transform", function(d) {
                	return "rotate(-65)" 
                });

  	svg.append("g")
      		.attr("class", "y axis")
      		.call(yAxis)
    		.append("text")
      		.attr("transform", "rotate(-90)")
      		.attr("y", 6)
      		.attr("dy", ".71em")
      		.style("text-anchor", "end")
      		.text("2011 Population");

  	svg.selectAll(".bar")
      		.data(data)
    		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", function(d) { 
			return x(d.county); 
		})
      		.attr("width", x.rangeBand())
      		.attr("y", function(d) { 
			return y(d.population2011); 
		})
      		.attr("height", function(d) { 
			return height - y(d.population2011);
		 });

  	d3.select("input").on("change", change);

  	var sortTimeout = setTimeout(function() {
    		d3.select("input")
			.property("checked", true)
			.each(change);
  	}, 2000);

  	function change() {
    		clearTimeout(sortTimeout);

    		// Copy-on-write since tweens are evaluated after a delay.
    		var x0 = x.domain(data.sort(this.checked ? function(a, b) { 
			return b.population2011 - a.population2011; 
		}
        	: function(a, b) { 
			return d3.ascending(a.county, b.county); 
		})
        	.map(function(d) { 
			return d.county; 
		}))
        	.copy();

	    	var transition = svg.transition().duration(750),
		delay = function(d, i) { 
			return i * 50; 
		};

	    	transition.selectAll(".bar").attr("x", function(d) { 
			return x0(d.county); 
		});

	    	transition.select(".x.axis")
			.call(xAxis)
			.selectAll("text")  
		    	.style("text-anchor", "end")
		    	.attr("dx", "-.8em")
		    	.attr("dy", ".15em")
	      		.selectAll("g")
			.delay(delay);
  	}
});
