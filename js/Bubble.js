class Bubble {
	constructor(data, width, height) {
		this.data = data;
		this.width = width;
		this.height = height;
		this.grouped = false;
		this.extremes = false;
		this.brushes = [];
		this.subset = [];
		this.drawBubble();
	}

	drawBubble() {
		// Create SVG
		// Create bubble section
	    var bubble_div = d3.select("body").append("div").classed("bubble_div", true);
	    // Handle event for unhiding when clicked
	    bubble_div.append("svg").classed("bubble_svg", true).attr("width", this.width).attr("height", this.height)
	    .on("click", function(d,i){
	    	// Brush cleanup
	    	for (var i = 0; i < self.brushes.length; i++) {
	    		d3.selectAll("g.brush").call(self.brushes[i].move, null);
	    	}
	    	d3.selectAll("circle").classed("unbrushed", false);
	    	self.table.data = self.data;
	    	self.table.sortTable(null);

	    	// Extremes cleanup
	    	if (self.extremes == true) {
		    	d3.selectAll(".extremes_div").remove();
		    	d3.selectAll(".tooltip").remove();
		    	d3.selectAll(".selected").classed("selected", false);
				self.selected = [];
				self.updateBubble();
				d3.select(".bubble_svg").selectAll("circle").attr("opacity", "1.0");
		    	d3.select(".bubble_svg").selectAll("text").attr("opacity", "1.0");
		    	d3.select(".bubble_svg").selectAll("g").attr("opacity", "1.0");
		    	d3.select(".bubble_svg").selectAll("path").attr("opacity", "1.0");
				self.extremes = false;
			}
	    });

	    var self = this;

		// Create event handler for toggle
	    var slider = d3.select(".switch").select("input");
	    slider.on("click", function(){
	    	self.grouped = d3.select(this).property("checked");
	    	self.updateBubble();
	    	self.table.data = self.data;
	    	self.table.sortTable(null);
	    });

	    // Create event handler for button
	    var button = d3.select(".extremes_button")
	    .on("click", function(i,d){
	    	self.extremes = true;
	    	// Create div and remove when clicked
	    	d3.select("body").append("div").classed("extremes_div", true)
	    	.on("click", function(d,i){
		    	// Extremes cleanup
		    	if (self.extremes == true) {
			    	d3.selectAll(".extremes_div").remove();
			    	d3.selectAll(".tooltip").remove();
			    	d3.selectAll(".selected").classed("selected", false);
					self.selected = [];
					self.updateBubble();
					d3.select(".bubble_svg").selectAll("circle").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("text").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("g").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("path").attr("opacity", "1.0");
					self.extremes = false;
				}
    		});

	    	// Change opacity on svg elements
	    	d3.select(".bubble_svg").selectAll("circle").attr("opacity", "0.2");
	    	d3.select(".bubble_svg").selectAll("text").attr("opacity", "0.2");
	    	d3.select(".bubble_svg").selectAll("g").attr("opacity", "0.2");
	    	d3.select(".bubble_svg").selectAll("path").attr("opacity", "0.2");
	    	
	    	// Leave selected unchanged
	    	d3.selectAll(".selected").attr("opacity", "1.0").each(function (d) {
	    		var c = d3.select(this);
				if (parseFloat(parseFloat(c.attr("cx"))) > 420) {
					// Display info
					var foreign = d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
	                	.attr("x", parseFloat(c.attr("cx"))-180).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
	                    .html("<div class=\"tooltip\">"+self.extremeGen(c.attr("id"))+"</div");

	                var div = foreign.select("div");
	                //https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	                var w = parseFloat(div.node().getBoundingClientRect().width);

	                // Draw path
	                d3.select(".bubble_svg").append("path").classed("tooltip", true)
	                	.attr("d", "M" + c.attr("cx") + " " + c.attr("cy") + "\
	                		L" + (parseFloat(c.attr("cx"))-188+w).toString() + " " + c.attr("cy"))
	                	.attr("fill", "none").attr("stroke", "black").attr("stroke-size", "2");
				} else {
					// Display info
					d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
	                	.attr("x", parseFloat(c.attr("cx"))+10).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
	                    .html("<div class=\"tooltip\">"+self.extremeGen(c.attr("id"))+"</div");

	                // Draw path
	                d3.select(".bubble_svg").append("path").classed("tooltip", true)
	                	.attr("d", "M" + c.attr("cx") + " " + c.attr("cy") + "\
	                		L" + (parseFloat(c.attr("cx"))+18).toString() + " " + c.attr("cy"))
	                	.attr("fill", "none").attr("stroke", "black").attr("stroke-size", "2");
                }
	    	});
	    });

	    var bubble = d3.select(".bubble_svg");

		// Create axes
		var x_scale1 = d3.scaleLinear()
                  .domain([0,50])
                  .range([500,115]);

		var x_axis1 = d3.axisTop()
                   .scale(x_scale1)
                   .ticks(6);

        var x_scale2 = d3.scaleLinear()
                  .domain([0,60])
                  .range([500,960]);

		var x_axis2 = d3.axisTop()
                   .scale(x_scale2)
                   .ticks(7);

		bubble.append("g").call(x_axis1).classed("x_axis", true).attr("transform", "translate(-87,50)");
		bubble.append("g").call(x_axis2).classed("x_axis", true).attr("transform", "translate(-87,50)");

        var vals = [];
        for (var i = 0; i < this.data.length; i++) {
        	vals[i] = parseInt(this.data[i]['total']);
        }

        var c_scale = d3.scaleLinear()
                  .domain([d3.min(vals), d3.max(vals)])
                  .range([3,11]);
		
		// Create labels
		var democrat = bubble.append("text").attr("x", "50").attr("y", "22").html("Democrat Leaning").attr("style","font: bold 20px sans-serif");
		var republican = bubble.append("text").attr("x", this.width-330).attr("y", "22").html("Republican Leaning").attr("style","font: bold 20px sans-serif");

		// Create reference line
		bubble.append("path").classed("reference", true).attr("d", "M413 60 L413 250");

		// Add circles
		this.updateBubble();
	}


	// Redraw bubble chart
	updateBubble() {
		var bubble = d3.select(".bubble_svg");
		bubble.selectAll("circle").remove();
		bubble.selectAll(".brush").remove();

		// Check if the bubbles are grouped by type
		if (this.grouped) {
			var brushScale = 135;
			this.brushes = [];
			for (var i = 0; i < 6; i++) {
				this.brushes[i] = d3.brushX().extent([[0,75+i*brushScale], [900,210+i*brushScale]]).on("start brush end", function(d,i){
					if (self.extremes == true) {
				    	d3.selectAll(".extremes_div").remove();
				    	d3.selectAll(".tooltip").remove();
				    	d3.selectAll(".selected").classed("selected", false);
						self.selected = [];
						self.updateBubble();
						d3.select(".bubble_svg").selectAll("circle").attr("opacity", "1.0");
				    	d3.select(".bubble_svg").selectAll("text").attr("opacity", "1.0");
				    	d3.select(".bubble_svg").selectAll("g").attr("opacity", "1.0");
				    	d3.select(".bubble_svg").selectAll("path").attr("opacity", "1.0");
						self.extremes = false;
					}	
					self.getBrushed();
				});
				d3.select(".bubble_svg").append("g").classed("brush", true).call(this.brushes[i]);	
			}
			var vals = [];
	        for (var i = 0; i < this.data.length; i++) {
	        	vals[i] = parseInt(this.data[i]['total']);
	        }

	        var c_scale = d3.scaleLinear()
	                  .domain([d3.min(vals), d3.max(vals)])
	                  .range([3,11]);

	        // Redraw Reference Line
	        d3.select(".reference").attr("d", "M413 60 L413 850");

			// Draw labels
			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "100")
				.html("Economy/fiscal issues").attr("style","font: bold 20px sans-serif");

			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "235")
				.html("Energy").attr("style","font: bold 20px sans-serif");

			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "370")
				.html("Crime/justic").attr("style","font: bold 20px sans-serif");

			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "505")
				.html("Education").attr("style","font: bold 20px sans-serif");

			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "640")
				.html("Health care").attr("style","font: bold 20px sans-serif");

			bubble.append("text").classed("bubbleLabel", true).attr("x", "50").attr("y", "775")
				.html("Mental health/substance abuse").attr("style","font: bold 20px sans-serif");

			// Draw circles
			for (var i = 0; i < this.data.length; i++) {
				var id = this.data[i]['phrase'].replace(/\s+/g, '')
				var circle = bubble.append("circle").attr("id", id);
				var x = this.data[i]['x'];
				var y = this.data[i]['y']+150;
				var total = c_scale(this.data[i]['total']);
				var cat = this.data[i]['category'];
				circle.attr("cx", x).attr("cy", y).attr("r", total).classed(cat.slice(0,3), true);
				var self = this;
				circle.on("mouseenter", function(d,i) {
					if (self.extremes == false) {
						var c = d3.select(this);
						if (parseFloat(parseFloat(c.attr("cx"))) > 420) {
							d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
			                	.attr("x", parseFloat(c.attr("cx"))-180).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
			                    .html("<div class=\"tooltip\">"+self.tooltipGen(c.attr("id"))+"</div");	
						} else {
							d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
			                	.attr("x", parseFloat(c.attr("cx"))+10).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
			                    .html("<div class=\"tooltip\">"+self.tooltipGen(c.attr("id"))+"</div");
		                }
	            	}
				});

				circle.on("mouseout", function (d,i) {
					if (self.extremes == false) {
	                	d3.select(".bubble_svg").selectAll(".tooltip").remove();
	                }
	            });

	            circle.on("click", function(d,i){
	            	if (!(d3.select(this).classed("selected"))) {
		            	d3.select(this).classed("selected", true);
	            	} else {
	            		d3.select(this).classed("selected", false);
	            	}	
	            });
			}

		} else {
			this.brushes = [];
			this.brushes[0] = d3.brushX().extent([[0,75], [900,225]]).on("start brush end", function(d,i){
				if (self.extremes == true) {
			    	d3.selectAll(".extremes_div").remove();
			    	d3.selectAll(".tooltip").remove();
			    	d3.selectAll(".selected").classed("selected", false);
					self.selected = [];
					self.updateBubble();
					d3.select(".bubble_svg").selectAll("circle").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("text").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("g").attr("opacity", "1.0");
			    	d3.select(".bubble_svg").selectAll("path").attr("opacity", "1.0");
					self.extremes = false;
				}
				self.getBrushed();
			});
			d3.select(".bubble_svg").append("g").classed("brush", true).call(this.brushes[0]);

			var vals = [];
	        for (var i = 0; i < this.data.length; i++) {
	        	vals[i] = parseInt(this.data[i]['total']);
	        }

	        var c_scale = d3.scaleLinear()
	                  .domain([d3.min(vals), d3.max(vals)])
	                  .range([3,11]);

			// Redraw Reference Line
	        d3.select(".reference").attr("d", "M413 60 L413 250");

			// Remove labels
			d3.selectAll(".bubbleLabel").remove();

			// Draw circles
			for (var i = 0; i < this.data.length; i++) {
				var id = this.data[i]['phrase'].replace(/\s+/g, '')
				var circle = bubble.append("circle").attr("id", id);
				var x = this.data[i]['sourceX']+this.data[i]['vx'];
				var y = this.data[i]['sourceY']+this.data[i]['vy']+150;
				var total = c_scale(this.data[i]['total']);
				var cat = this.data[i]['category'];
				circle.attr("cx", x).attr("cy", y).attr("r", total).classed(cat.slice(0,3), true);
				var self = this;
				circle.on("mouseenter", function(d, i) {
					if (self.extremes == false) {
						var c = d3.select(this);
						if (parseFloat(parseFloat(c.attr("cx"))) > 420) {
							d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
			                	.attr("x", parseFloat(c.attr("cx"))-180).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
			                    .html("<div class=\"tooltip\">"+self.tooltipGen(c.attr("id"))+"</div");	
						} else {
							d3.select(".bubble_svg").append("foreignObject").classed("tooltip", true)
			                	.attr("x", parseFloat(c.attr("cx"))+10).attr("y", c.attr("cy")).attr("height", "150").attr("width", "170")
			                    .html("<div class=\"tooltip\">"+self.tooltipGen(c.attr("id"))+"</div");
		                }
	            	}
				});

				circle.on("mouseout", function (d, i) {
	                if (self.extremes == false) {
	                	d3.select(".bubble_svg").selectAll(".tooltip").remove();
	                }
	            });

	            circle.on("click", function(d,i){
	            	if (!(d3.select(this).classed("selected"))) {
		            	d3.select(this).classed("selected", true);
	            	} else {
	            		d3.select(this).classed("selected", false);
	            	}	
	            });
			}
		}
	}


	// Generate tooltips for hovering over circles
	tooltipGen(phrase) {
		var position = undefined;
		var total = undefined;

		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i]['phrase'].replace(/\s+/g, '') == phrase) {
				position = parseFloat(this.data[i]['position']).toFixed(4);
				if (position == 0) {
					position = "0%";
				} else if (position < 0) {
					position *= -1;
					position = "D+ "+position.toString()+"%";
				} else {
					position = "R+ "+position.toString()+"%";
				}
				total = (parseFloat((this.data[i]['total'])/50)*100).toFixed(0).toString();
				break;
			}
		}
		var result = "<h2>"+this.data[i]['phrase'].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})+"</h2><p>"+position+"</p><p>In "+total+"% of speeches</p>";
		return result;
	}


	// Generate info boxes for extremes
	extremeGen(phrase) {
		var position = undefined;
		var text = undefined;

		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i]['phrase'].replace(/\s+/g, '') == phrase) {
				position = parseFloat(this.data[i]['position']).toFixed(4);
				if (position == 0) {
					text = "Both Democrats and Republicans mentioned " + this.data[i]['phrase'] + " the same amount.";
				} else if (position < 0) {
					position *= -1;
					text = "Democrats mentioned " + this.data[i]['phrase'] + " " + position.toString() + "% more often than Republicans.";
				} else {
					text = "Republicans mentioned " + this.data[i]['phrase'] + " " + position.toString() + "% more often than Democrats.";
				} 
				break;
			}
		}
		var result = "<p>"+text+"</p>";
		return result;
	}


	// Get all brushed phrases
	getBrushed() {
		this.subset = []; // Subset of this.data based on phrases
		var list = [];	// Stores phrases
		var bounds = []; // Stores brush bounds

		d3.selectAll(".brush").each(function(d,i) {
			bounds.push(d3.brushSelection(d3.select(this).node()));
		});

		d3.selectAll("circle").classed("unbrushed", true);
		
			// check if grouped
			if (!this.grouped) {
				if (bounds[0] != null) {
					d3.selectAll("circle").each(function(d,i){
						var c = d3.select(this);
						var x = parseFloat(c.attr("cx"));
						if (x > parseFloat(bounds[0][0]) && x < parseFloat(bounds[0][1])) {
							c.classed("unbrushed", false);
							list.push(c.attr("id"));
						}
					});
				}
			} else {
				d3.selectAll("circle").each(function(d,i){
				var c = d3.select(this);
				var x = parseFloat(c.attr("cx"));
				if (c.classed('eco') && bounds[0] != undefined) {
					if (x > parseFloat(bounds[0][0]) && x < parseFloat(bounds[0][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				} else if (c.classed('ene') && bounds[1] != undefined) {
					if (x > parseFloat(bounds[1][0]) && x < parseFloat(bounds[1][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				} else if (c.classed('cri') && bounds[2] != undefined) {
					if (x > parseFloat(bounds[2][0]) && x < parseFloat(bounds[2][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				} else if (c.classed('edu') && bounds[3] != undefined) {
					if (x > parseFloat(bounds[3][0]) && x < parseFloat(bounds[3][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				} else if (c.classed('hea') && bounds[4] != undefined) {
					if (x > parseFloat(bounds[4][0]) && x < parseFloat(bounds[4][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				} else if (c.classed('men') && bounds[5] != undefined) {
					if (x > parseFloat(bounds[5][0]) && x < parseFloat(bounds[5][1])) {
						c.classed("unbrushed", false);
						list.push(c.attr("id"));
					}
				}

			});
		}


		// Update the subset
		for (var i = 0; i < this.data.length; i++) {
			var str = this.data[i]['phrase'].replace(/\s+/g, '');
			if (list.indexOf(str) >= 0) {
				this.subset.push(this.data[i]);
			}
		}

		// Count instances of brushed circles
		var count = 0;
		d3.selectAll("circle").each(function(d,i){ 
			if (!d3.select(this).classed("unbrushed")) {
				count += 1;
			}
		});

		// If the subset is not empty and there are brushed circles set the table data as the subset
		if (this.subset.length <= 0 && count != 0) {
			this.table.data = this.data;
		} else {
			this.table.data = this.subset;
		}

		// Effectively redraws the table with the subset
		this.table.sortTable(null);
	}
}