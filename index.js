////////////////////////////////////////////////////////////////////////////////
// Datasets, data manipulation functions
var dataset_ind; // dataset with individuals as rows
var dataset_counts; // dataset with topline counts for each experience
function getOverlapCounts(var1, var2) {
  var dataset_filtered = dataset_ind.filter(function(d) { return d.var1==1 & d.var2==1; });
}; // end getCounts
function getOrder(data) {
  console.log(data.sort(function(a,b) { return a.count<b.count; }));
}; // end getOrder




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
var margin_top = margin_bottom = margin_left = margin_right = margin_btwn = 20;
var margin_btwnCol = 15;
var w_labels = 100;
var circlesPerRow = (w - margin_left - w_labels - margin_btwn - margin_right)/10;
var circlesPewCol = Math.ceil(219/circlesPerRow);
var h_bigLabels = 20;
var circleRadius = 4;
var circleSpace = 10;
// adjusted margins
var adjusted_left = adjusted_right = (w - w_labels - circlesPerRow*circleSpace)/2

function setup() {
  // FIRST VIEW: One column
  // Set up groups
  var gCol = svg.append("g").attr("transform", "translate(" + adjusted_left + "," + margin_top + ")");

  // Create labels
  var dataset_labels = ["COLLEGE", "GRADUATE SCHOOL", "CAREER", "POLITICS"];
  gCol.selectAll(".gBigLabels")
      .data(dataset_labels)
      .enter()
      .append("text")
      .attr("class", "bigLabels")
      .attr("x", 0)
      .attr("y", function(d,i) {
        if (i==0) { return 10; }
        else if (i==1) { return (20+5)*circleSpace + h_bigLabels; } // 20 bars and some wiggle room
        else if (i==2) { return (20+5+20+5)*circleSpace + h_bigLabels*2; }
        else if (i==3) { return (20+5+20+5+85+5)*circleSpace + h_bigLabels*3; }
      })
      .text(function(d) { return d; });
  // Create dots
  // College experience
  for (var j=0; j<4; j++) {
    if (j==0) { var college = "none"; }
    else if (j==1) { var college = "public"; }
    else if (j==2) { var college = "private"; }
    else { var college = "elite"; };
    gCol.selectAll("collegeDots")
        .data(dataset_ind.filter(function(d) { return d.edu_college==college; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPewCol); })
        .attr("cy", function(d,i) { return h_bigLabels + (10 + circleSpace*circlesPewCol)*j + circleSpace*(i%circlesPewCol); })
        .attr("r", circleRadius);
  };
  gCol.selectAll("labels")
      .data(["No Bachelor's degree", "Public school", "Private school", "Elite school"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels + circleSpace*(circlesPewCol/3) + (10 + circleSpace*circlesPewCol)*i; })
      .call(wrap, w_labels-15);
  // Graduate school experience
  for (var j=0; j<4; j++) {
    var currVar = dataset_ind.columns[(j+3)];
    gCol.selectAll("gradDots")
        .data(dataset_ind.filter(function(d) { return d[currVar]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPewCol); })
        .attr("cy", function(d,i) { return h_bigLabels*2 + (20+5)*circleSpace + (10 + circleSpace*circlesPewCol)*j + circleSpace*(i%circlesPewCol); })
        .attr("r", circleRadius);
  };
  gCol.selectAll("labels")
      .data(["Medical school", "Law school", "Masters", "Doctorate"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*2 + (20+5)*circleSpace + circleSpace*(circlesPewCol/3) + (10 + circleSpace*circlesPewCol)*i; })
      .call(wrap, w_labels-15);
  // Career
  for (var j=0; j<15; j++) {
    var currVar = dataset_ind.columns[(j+7)];
    gCol.selectAll("gradDots")
        .data(dataset_ind.filter(function(d) { return d[currVar]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPewCol); })
        .attr("cy", function(d,i) { return h_bigLabels*3 + (40+10)*circleSpace + (10 + circleSpace*circlesPewCol)*j + circleSpace*(i%circlesPewCol); })
        .attr("r", circleRadius);
  };
  gCol.selectAll("labels")
      .data(["Blue-collar/ service job", "Business/ management", "Education", "Farming/ ranching", "Law enforcement", "Lobbying/ activism",
             "Media", "Medicine", "Military", "Nonprofits & unions", "Private law", "Real estate", "Religious leader", "Science/ engineering", "Sports"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*3 + (40+10)*circleSpace + circleSpace*(circlesPewCol/3) + (10 + circleSpace*circlesPewCol)*i; })
      .call(wrap, w_labels-15);
  // Government
  for (var j=0; j<5; j++) {
    var currVar = dataset_ind.columns[(j+22)];
    gCol.selectAll("gradDots")
        .data(dataset_ind.filter(function(d) { return d[currVar]==1; }))
        .enter()
        .append("circle")
        .attr("class", "memberDots")
        .attr("cx", function(d,i) { return w_labels + circleSpace*Math.floor(i/circlesPewCol); })
        .attr("cy", function(d,i) { return h_bigLabels*4 + (20+5+20+5+85+5)*circleSpace + (10 + circleSpace*circlesPewCol)*j + circleSpace*(i%circlesPewCol); })
        .attr("r", circleRadius);
  };
  gCol.selectAll("labels")
      .data(["Federal or state office", "Local government", "No previous office", "Public lawyer or judge", "State legislature"])
      .enter()
      .append("text")
      .attr("class", "smallLabels")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d,i) { return h_bigLabels*4 + (20+5+20+5+85+5)*circleSpace + circleSpace*(circlesPewCol/3) + (10 + circleSpace*circlesPewCol)*i; })
      .call(wrap, w_labels-15);

}; // end setup

function init() {
  setup();
}; // end init
////////////////////////////////////////////////////////////////////////////////
function rowConverter1(d) {
  return {
    full_name: d.full_name,
    state: d.state,
    edu_college: d.edu_college,
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
    party: d.party
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
