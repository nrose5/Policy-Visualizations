class Table {

	constructor(data) {
		this.data = data;
		this.sorting = undefined;
		this.drawTable();
	}


	drawTable() {
		// Create bubble section
	    var table_div = d3.select("body").append("div").classed("table_div", true);
	    table_div.append("svg").classed("table_svg", true);

	    var table = d3.select(".table_svg");

	    var self = this;

	    // Phrase
	    table.append("rect").classed("tableTitleBox", true).attr("x", "0").attr("y", "0").attr("width", "180").attr("height", "50")
	    .on("click", function(d,i) {
	    	self.sortTable("phrase");
	    });
	    table.append("text").classed("tableTitle", true).attr("x", "70").attr("y", "30").html("Phrase")
	    .on("click", function(d,i) {
	    	self.sortTable("phrase");
	    });

	    // Frequency
	    table.append("rect").classed("tableTitleBox", true).attr("x", "190").attr("y", "0").attr("width", "200").attr("height", "50")
	    .on("click", function(d,i) {
	    	self.sortTable("freq");
	    });
	    table.append("text").classed("tableTitle", true).attr("x", "255").attr("y", "30").html("Frequency")
	    .on("click", function(d,i) {
	    	self.sortTable("freq");
	    });

	    var f_scale = d3.scaleLinear()
                  .domain([0,1])
                  .range([200, 380]);

		var f_axis = d3.axisTop()
                   .scale(f_scale)
                   .ticks(3);

		table.append("g").call(f_axis).classed("f_axis", true).attr("transform", "translate(0,50)")
		.on("click", function(d,i) {
	    	self.sortTable("freq");
	    });

	    // Percentages
	    table.append("rect").classed("tableTitleBox", true).attr("x", "400").attr("y", "0").attr("width", "200").attr("height", "50")
	    .on("click", function(d,i) {
	    	self.sortTable("percent");
	    });
	    table.append("text").classed("tableTitle", true).attr("x", "460").attr("y", "30").html("Percentages")
	    .on("click", function(d,i) {
	    	self.sortTable("percent");
	    });

	    var p_scale1 = d3.scaleLinear()
                  .domain([0,100])
                  .range([500, 410]);

		var p_axis1 = d3.axisTop()
                   .scale(p_scale1)
                   .ticks(3);

		table.append("g").call(p_axis1).classed("p_axis", true).attr("transform", "translate(0,50)")
		.on("click", function(d,i) {
	    	self.sortTable("percent");
	    });

		var p_scale2 = d3.scaleLinear()
                  .domain([0,100])
                  .range([500, 590]);

		var p_axis2 = d3.axisTop()
                   .scale(p_scale2)
                   .ticks(3);

		table.append("g").call(p_axis2).classed("p_axis", true).attr("transform", "translate(0,50)")
		.on("click", function(d,i) {
	    	self.sortTable("percent");
	    });

	    // Total
	    table.append("rect").classed("tableTitleBox", true).attr("x", "610").attr("y", "0").attr("width", "80").attr("height", "50")
	    .on("click", function(d,i) {
	    	self.sortTable("total");
	    });
	    table.append("text").classed("tableTitle", true).attr("x", "635").attr("y", "30").html("Total")
	    .on("click", function(d,i) {
	    	self.sortTable("total");
	    });

	    // Draw table
	    this.sortTable("phrase");

	}


	sortTable(type) {
		// Remove table elements
		d3.selectAll(".tablePhrase").remove();
		d3.selectAll(".tableFreq").remove();
		d3.selectAll(".tablePercent").remove();
		d3.selectAll(".tableTotal").remove();

		var table = d3.select(".table_svg");

		var data = this.data;

		var f_scale = d3.scaleLinear()
                  .domain([0,1])
                  .range([200, 380]);

	    var p_scale1 = d3.scaleLinear()
                  .domain([0,100])
                  .range([500, 410]);

		var p_scale2 = d3.scaleLinear()
                  .domain([0,100])
                  .range([500, 590]);

        // Sort data
        if (this.sorting == type) {
        	this.data = this.data.reverse();
        } else {
			if (type == "phrase") {
				this.data = this.sort(data, 0, data.length-1, "phrase");
			} else if (type == "freq") {
				this.data = this.sort(data, 0, data.length-1, "total");
			} else if (type == "percent") {
				this.data = this.sort(data, 0, data.length-1, "position");
			} else if (type == "total") {
				this.data = this.sort(data, 0, data.length-1, "total");
			} else {
				type = this.sorting;
			}
		}

		// Update table
		for (var i = 0; i < this.data.length; i++) {
			// Seperator
			table.append("rect").classed("seperator", true).attr("x", "0").attr("y", i*25 + 58).attr("width", "700").attr("height", "1");

	    	// Category
	    	var cat = this.data[i]['category'];

	    	// Phrase
	    	var phrase = this.data[i]['phrase'];
	    	// Capitalize every word
	    	// https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
	    	phrase = phrase.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

	    	table.append("text").classed("tablePhrase", true).attr("x", "10").attr("y", i*25 + 75).html(phrase);

	    	// Frequency
	    	var freq = (parseFloat(this.data[i]['total'])/50);
	    	freq = f_scale(freq)-200;
	    	table.append("rect").classed("tableFreq", true).attr("x", "200").attr("y", i*25 + 61)
	    	.attr("width", freq).attr("height", 20).classed(cat.slice(0,3), true);

	    	// Percentages
	    	var percentages = this.data[i]['position'];
	    	percentages = parseFloat(percentages);
	    	if (percentages < 0) {
	    		percentages = p_scale1(percentages) - 500;
		    	table.append("rect").classed("tablePercent", true).attr("x", 500 - percentages).attr("y", i*25 + 61)
		    	.attr("width", percentages).attr("height", 20).classed("democrat", true);
	    	} else {
	    		percentages = p_scale2(percentages) - 500;
	    		table.append("rect").classed("tablePercent", true).attr("x", "500").attr("y", i*25 + 61)
		    	.attr("width", percentages).attr("height", 20).classed("republican", true);
	    	}

	    	// Total
	    	var total = this.data[i]['total'];
	    	table.append("text").classed("tableTotal", true).attr("x", "645").attr("y", i*25 + 75).html(total);
	    }

	    this.sorting = type;

	}


	// Quicksort: https://www.geeksforgeeks.org/quick-sort/
	/* low  --> Starting index,  high  --> Ending index */
	sort(arr, low, high, arg) {
		if (low < high) {
	        /* pi is partitioning index, arr[pi] is now
	           at right place */
	        var result = this.partition(arr, low, high, arg);
	        var pi = result[0];
	        arr = result[1];

	        arr = this.sort(arr, low, pi - 1, arg);  // Before pi
	        arr = this.sort(arr, pi + 1, high, arg); // After pi
    	}
    	return arr;
	}


	/* This function takes last element as pivot, places
    the pivot element at its correct position in sorted
    array, and places all smaller (smaller than pivot)
    to left of pivot and all greater elements to right
    of pivot */
	partition (arr, low, high, arg) {
		if (arg == "total") {
			for (var i = 0; i < arr.length; i++) {
				arr[i]['total'] = parseInt(arr[i]['total']);
			}
		}
		// pivot (Element to be placed at right position)
	    var pivot = arr[high][arg];  
	 
	    var i = (low - 1)  // Index of smaller element

	    for (var j = low; j <= high - 1; j++) {
	        // If current element is smaller than the pivot
	        if (arr[j][arg] < pivot) {
	            i++;    // increment index of smaller element
	            var tmp = arr[i]; 
	            arr[i] = arr[j];
	            arr[j] = tmp;
	        }
	    }

	    var tmp = arr[i + 1];
	    arr[i + 1] = arr[high];
	    arr[high] = tmp;
	    return [(i + 1), arr];
	}
}