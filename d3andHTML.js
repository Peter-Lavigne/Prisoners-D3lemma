//d3 chart-making and HTML editing

//creates the chart
function chart(){
  var marginUpDown = 40,
      marginLeftRight = 80,
      width = 960,
      height = 500,
      barWidth = width / data.length,
      barHeight = height / data[0].length;
  var chart = d3.select(".chart")
      .attr("width", width + 2 * marginLeftRight)
      .attr("height", height + 2 * marginUpDown)
      .style("overflow", "visible");
  var nodes = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i){
        return "translate(" + (i * barWidth + marginLeftRight) + ",0)";
      })
      .selectAll("g")
      .data(function(d){return d;})
      .enter().append("g")
      .attr("transform", function(d, i){
        return "translate(0," +
            (height + marginUpDown - ((i + 1) * barHeight)) + ")";
      })
      .on("mouseover", function(d){
        d3.select(this).style("stroke","gray");
      })
      .on("mouseout", function(d){
        d3.select(this).style("stroke","none");
        focus.style("visibility","hidden");
      })
      .on("mousemove", function(d){
        focus.style("visibility","visible");
        var mouse = d3.mouse(d3.select('svg').node());
        focus.attr("transform", "translate(" +
                  mouse[0] + "," +
                  (mouse[1] - 20) + ")")
             .selectAll("text")
             .text(function(d2, i){
               return i ? "Points: " + d.points : d.title;
             });
      });
  nodes.append("rect")
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", function(d){return d.color;});
  var focus = chart.append("g")
      .style("pointer-events", "none")
      .style("visibility","hidden");
  focus.append("text")
      .style("font-size", 18);
  focus.append("text")
      .style("font-size", 14)
      .attr("dy", 16);
}

//adds a user-made strategy
function customStrat(){
  var userCode = Function("h",
      "this.title = \"" + $("title").value + "\";" +
      "this.description = \"" + $("description").value + "\";" +
      "this.color = \"" + $("color-chooser-div").style.backgroundColor +
      "\";" + $("code").value);
  strategyList.push(userCode);
  addStrat($("title").value, $("description").value);
}

//adds a strategy to the strategy list
function addStrat(name, description, checked){
  $("stratBoxes").innerHTML =
      "<tr><td><input class=\"strategyCheckbox\"" +
      "type=\"checkbox\"checked></td><td>" +
      "<p class=\"strategyTitle\">" +
      name + "</p></td><td>" +
      description + "</td></tr>" +
      $("stratBoxes").innerHTML;
}

//sets up checkboxes
function setupCheckboxes(){
  for (var i = 0; i < strategyList.length; i++){
    var p = new Player(strategyList[i]);
    addStrat(p.title, p.description);
  }
}

//sets up the color chooser table
function setupColorChooser(){
  var colors=["lightseagreen", "orange",  "orchid",
              "burlywood", "green", "gainsboro",
              "crimson", "gray"];
  var table = $("color-chooser-table");
  for (var i = 0; i < colors.length; i++){
    if (i % 4 == 0) table.insertRow();
    var cell = table.rows[table.rows.length - 1].insertCell();
    cell.classList.toggle("color-td");
    cell.innerHTML = "<div style=\"background-color:" +
        colors[i] + "\"class=\"color-div\"></div>";
  }
}

//opens, closes, and changes the color chooser
window.onclick = function(event) {
  if (!event.target.matches(".color-div")) {
    $("color-chooser-table").classList.remove("show");
  } else {
    $("color-chooser-div").style.backgroundColor =
        event.target.style.backgroundColor;
    $("color-chooser-table").classList.toggle("show");
  }
}

//additonal options dropdown menu
function additionalOptionsDropdown(){
	$("additional-options").classList.toggle("show");
	$("additional-options-triangle").innerHTML = $("additional-options").
			classList.contains("show") ? "&#9656" : "&#9662";
}

//user strategy dropdown menu
function userStrategyDropdown(){
	$("user-strategy").classList.toggle("show");
	$("user-strategy-triangle").innerHTML = $("user-strategy").
			classList.contains("show") ? "&#9656" : "&#9662";
}
