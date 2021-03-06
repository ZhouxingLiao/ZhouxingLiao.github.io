'use strict'
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
	.translate([width / 2, height / 2]) // translate to center of screen
	.scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
	.projection(projection); // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
	.range(["rgb(255,255,178)", "rgb(254,204,92)", "rgb(253,141,60)", "rgb(227,26,28)"]);

var legendText = ["32-38", "28-32", "22-28", "0-22"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// Load in my states data!
d3.csv("finalprojectTable_FinalA.csv", function (data) {
	color.domain([22, 28, 32, 38]); // setting the range of the input data

	// Load GeoJSON data and merge with states data
	d3.json("us-states.json", function (json) {

		// Loop through each state data value in the .csv file

		for (var i = 0; i < data.length; i++) {

			// Grab State Name
			var dataState = data[i].state;

			// Grab data value 
			var dataValue = data[i].obesrate2016;

			// Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.name;

				if (dataState == jsonState) {

					// Copy the data value into the JSONs
					json.features[j].properties.obesrate2016 = dataValue;

					// Stop looking through the JSON
					break;
				}
			}
		}

		// Bind the data to the SVG and create one path per GeoJSON feature
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function (d) {

				// Get data value
				var value = d.properties.obesrate2016;

				if (value) {
					//If value exists…
					return color(value);
				} else {
					//If value is undefined…
					return "rgb(213,222,217)";
				}
			});




		// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
		var legend = d3.select(body).append("svg")
			.attr("class", "legend")
			.attr("width", 140)
			.attr("height", 200)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter()
			.append("g")
			.attr("transform", function (d, i) {
				return "translate(0," + i * 20 + ")";
			});

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function (d) {
				return d;
			});
	});


});