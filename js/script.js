/* 
 * Noah Rose
 * CIS 399 Data Visualization
 * Spring 2020
 * Final Project
 */

/**
* Requests the file and executes a callback with the parsed result once
* it is available
* @param {string} path - The path to the file.
* @param {function} callback - The callback function to execute once the result is available
*/

function fetchJSONFile(path, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

class Main {

    constructor(data) {

    }
}


fetchJSONFile('data/words.json', function(data) {
    console.log(data);
    // Basic layout setup
    // Create info text
    var info1 = "At the beginning of the year,";
    var info2 = " each governor lays out their policy priorities in their version of the State of the Union Addresss - a \"state of the state\" address. The team at 538 conducted a text analysis of all 50 governors' 2019 state of the state speeches to see what issues were talked about the most and whether there were differences between what Democratic and Republican governors were focusing on.";

    d3.select("#header-wrap").append("div").classed("info-wrap", true).attr("style", "display: inline-block; margin-left: 50px; max-width: 750px;");

    d3.select(".info-wrap").append("text").classed("info", true).attr("style", "font-size: 20px;").html(info1);
    d3.select(".info-wrap").append("text").classed("info", true).html(info2);

    // Create controls section
    var button_div = d3.select("body").append("div").classed("button_div", true);
    button_div.append("div").classed("button_div_inner", true);

    // Create slider
    d3.select(".button_div_inner").append("text").html("Grouped by Topic").attr("style", "margin-right: 20px; vertical-align: -7px;");
    var slider = d3.select(".button_div_inner").append("label").classed("switch", true).attr("style", "margin-right: 20px;");
    slider.append("input").attr("type", "checkbox");
    slider.append("span").classed("slider round", true);

    // Create button
    var button = d3.select(".button_div_inner").append("button").classed("extremes_button", true).html("Show Extremes").attr("style", "vertical-align: -10px;")

    // Create class instances for the two displays
    bubble = new Bubble(data, 900, 950);
    table = new Table(data);       
    bubble.table = table;
});

/* 
 * Sources:
 * https://www.w3schools.com/howto/howto_css_switch.asp
 * https://www.w3schools.com/tags/tag_button.asp
 * https://stackoverflow.com/questions/5587458/how-to-move-an-element-down-a-litte-bit-in-html
 * https://www.w3schools.com/cssref/pr_dim_max-width.asp
 * https://stackoverflow.com/questions/39149846/why-am-i-seeing-a-404-not-found-error-failed-to-load-favicon-ico-when-not-usin
 * https://stackoverflow.com/questions/21805508/chrome-automatically-highlighting-my-button-in-my-extension
 * https://stackoverflow.com/questions/49258220/how-to-check-checkbox-property-in-d3-js
 * https://stackoverflow.com/questions/39626858/how-to-set-fixed-no-of-ticks-on-axis-in-d3-js/39639729
 * https://stackoverflow.com/questions/8159524/javascript-pushing-element-at-the-beginning-of-an-array
 * https://stackoverflow.com/questions/8344688/how-to-get-scrollbars-in-svg
 * https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
 * https://stackoverflow.com/questions/3250790/making-a-div-that-covers-the-entire-page
 * https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
 * https://github.com/d3/d3-brush/issues/10
 * https://stackoverflow.com/questions/2430000/determine-if-string-is-in-list-in-javascript
 */