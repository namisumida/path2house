////////////////////////////////////////////////////////////////////////////////
// Helper functions
// Datasets, data manipulation functions
var dataset_ind; // dataset with individuals as rows
var dataset_counts; // dataset with topline counts for each experience
function getOverlapCounts(var1, var2) {
  var dataset_filtered = dataset_ind.filter(function(d) { return d.var1==1 & d.var2==1; });
}; // end getCounts
function getOrder(counts_data) {
  var sorted_data = counts_data.sort(function(a,b) { return b.count-a.count; });
  var sorted_exp = [];
  for (var i=0; i<sorted_data.length; i++) {
    sorted_exp.push(sorted_data[i].experience);
  }
  return(sorted_exp);
}; // end getOrder
function convertLabelToVariable(label) {
  var labels = ["Public school", "Private school", "Elite school", "No Bachelor's degree","Law school", "Masters", "Medical school", "Doctorate","Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader","State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"];
  var varNames = ["college_public","college_private","college_elite","college_none","edu_law", "edu_masters", "edu_med", "edu_doctorate", "work_business", "work_privatelaw", "work_military", "work_education", "work_nonprofits", "work_medicine", "work_realestate", "work_farming", "work_media", "work_lobbying", "work_bluecollar", "work_science", "work_lawenforcement", "work_sports", "work_religiousleader", "gov_stateleg", "gov_local", "gov_none", "gov_fedstate", "gov_publiclawyerjudge"];
  return varNames[labels.indexOf(label)];
}; // end convertLabelToVariable
function clickFunction(currVar) {
  svg.selectAll(".memberDots")
     .filter(function(d) { return d[currVar]==1; })
     .style("fill", brown)
}; // end click function



////////////////////////////////////////////////////////////////////////////////
// text wrapping function
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.3, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
        }
    }
  });
}; // end wrap function



////////////////////////////////////////////////////////////////////////////////
const svg = d3.select("#chart-svg");
// Defining margins
var w = document.getElementById("chart-svg").getBoundingClientRect().width;
// Define universal margins - first setting to figure out margins for the 2 views
var margin_top = margin_bottom = margin_btwn = 20;
var margin_btwnCol = 15;
var w_labels = 105;
var circleRadius = 5;
var circleSpace = 12;
var circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
var circlesPerCol = Math.ceil(219/circlesPerRowMax); // max number of members in one category
var circlesPerRow = Math.ceil(219/circlesPerCol);
var h_bigLabels = 20;
// adjusted margins
var margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2;
// re-calculate height
var h = margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*28 + margin_btwn*3 + margin_bottom;
document.getElementById("chart-svg").style.height = h;
// Colors
var green = d3.color("#377668");
var brown = d3.color("#A45A25");





function setup() {
  // FIRST VIEW: One column
  // Set up groups
  var gCol = svg.append("g").attr("transform", "translate(" + margin_left + "," + margin_top + ")");

  // Create big labels
  var dataset_labels = ["COLLEGE", "GRADUATE SCHOOL", "CAREER", "POLITICAL OFFICE"];
  gCol.selectAll(".gBigLabels")
      .data(dataset_labels)
      .enter()
      .append("text")
      .attr("class", "bigLabels")
      .attr("x", 0)
      .attr("y", function(d,i) {
        if (i==0) { return 10; }
        else if (i==1) { return h_bigLabels + (circlesPerCol*circleSpace + 10)*4 + margin_btwn; }
        else if (i==2) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2; }
        else if (i==3) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3; }
      })
      .text(function(d) { return d; });

  // College experience
  // Get order
  var order_college = getOrder(dataset_counts.slice(0,4));
  // Create dots
  for (var j=0; j<4; j++) {
    gCol.selectAll("collegeDots")
        .data(dataset_ind.filter(function(d) { return d[order_college[j]]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPerCol); })
        .attr("cy", function(d,i) { return h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); })
        .attr("r", circleRadius);
  };
  // Create labels
  gCol.selectAll("labels")
      .data(["Public school", "Private school", "Elite school", "No Bachelor's degree"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
      .call(wrap, w_labels-20);

  // Graduate school experience
  // Get order
  var order_grad = getOrder(dataset_counts.slice(4,8));
  // Create dots
  for (var j=0; j<4; j++) {
    gCol.selectAll("gradDots")
        .data(dataset_ind.filter(function(d) { return d[order_grad[j]]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPerCol); })
        .attr("cy", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
        .attr("r", circleRadius);
  };
  // Create labels
  gCol.selectAll("labels")
      .data(["Law school", "Masters", "Medical school", "Doctorate"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
      .call(wrap, w_labels-20);

  // Career
  // Get order
  var order_career = getOrder(dataset_counts.slice(8,23));
  // Create dots
  for (var j=0; j<15; j++) {
    gCol.selectAll("workDots")
        .data(dataset_ind.filter(function(d) { return d[order_career[j]]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPerCol); })
        .attr("cy", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
        .attr("r", circleRadius);
  };
  // Create labels
  gCol.selectAll("labels")
      .data(["Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
      .call(wrap, w_labels-20);

  // Government
  // Get order
  var order_gov = getOrder(dataset_counts.slice(23,28));
  for (var j=0; j<5; j++) {
    gCol.selectAll("govDots")
        .data(dataset_ind.filter(function(d) { return d[order_gov[j]]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPerCol); })
        .attr("cy", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
        .attr("r", circleRadius);
  };
  gCol.selectAll("labels")
      .data(["State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
      .call(wrap, w_labels-20);

  // Mouseover feature
  svg.selectAll(".memberDots")
     .on("mouseover", function(d) {
       var currDot = d3.select(this);
       var currX = parseInt(currDot.attr("cx"));
       var currY = parseInt(currDot.attr("cy"));
       // style changes
       currDot.style("fill", d3.color("#D1A730"));
       // tooltip
       gCol.append("rect")
           .attr("class", "mouseover_back")
           .attr("x", currX+10)
           .attr("y", currY)
           .attr("width", 100)
           .attr("height", 20)
           .style("fill", "white");

       gCol.append("text")
           .attr("class", "mouseover_text")
           .text(function() { return d.full_name + " (" + d.state + ")"; })
           .attr("x", currX+15)
           .attr("y", currY+10)
           .call(wrap, 95);
     })
     .on("mouseout", function() {
       d3.select(this).style("fill", green);
       svg.selectAll(".mouseover_text").remove();
       svg.selectAll(".mouseover_back").remove();
     });

  // Labels on click feature
  svg.selectAll(".smallLabels")
     .on("click", function() {
       // Change all dots to green and labels to black initially
       svg.selectAll(".smallLabels")
          .style("fill", "black")
          .style("font-weight", 400);
       svg.selectAll(".memberDots").style("fill", green);

       var selection = d3.select(this);
       var currText = selection.text();
       selection.style("font-weight", 500)
                .style("fill", brown)
       clickFunction(convertLabelToVariable(selection.text()));
     })

}; // end setup

function init() {
  setup();
}; // end init
////////////////////////////////////////////////////////////////////////////////
function rowConverter1(d) {
  return {
    full_name: d.full_name,
    state: d.state,
    edu_med: parseInt(parseInt(d.edu_med)),
    edu_law: parseInt(d.edu_law),
    edu_masters: parseInt(d.edu_masters),
    edu_doctorate: parseInt(d.edu_doctorate),
    work_bluecollar: parseInt(d.work_bluecollar),
    work_business: parseInt(d.work_business),
    work_education: parseInt(d.work_education),
    work_farming: parseInt(d.work_farming),
    work_lawenforcement: parseInt(d.work_lawenforcement),
    work_lobbying: parseInt(d.work_lobbying),
    work_media: parseInt(d.work_media),
    work_medicine: parseInt(d.work_medicine),
    work_military: parseInt(d.work_military),
    work_nonprofits: parseInt(d.work_nonprofits),
    work_privatelaw: parseInt(d.work_privatelaw),
    work_realestate: parseInt(d.work_realestate),
    work_religiousleader: parseInt(d.work_religiousleader),
    work_science: parseInt(d.work_science),
    work_sports: parseInt(d.work_sports),
    gov_fedstate: parseInt(d.gov_fedstate),
    gov_local: parseInt(d.gov_local),
    gov_none: parseInt(d.gov_none),
    gov_publiclawyerjudge: parseInt(d.gov_publiclawyerjudge),
    gov_stateleg: parseInt(d.gov_stateleg),
    new: parseInt(d.new),
    party: d.party,
    college_none: parseInt(d.college_none),
    college_public: parseInt(d.college_public),
    college_private: parseInt(d.college_private),
    college_elite: parseInt(d.college_elite)
  }
}; // end rowConverter1
function rowConverter2(d) {
  return {
    experience: d.experience,
    count: parseInt(d.count)
  }
}; // end rowConverter2

d3.csv("Data/merged.csv", rowConverter1, function(data1) {
  d3.csv("Data/counts.csv", rowConverter2, function(data2) {
    dataset_ind = data1;
    dataset_counts = data2;
    init();
  })
})
