function init() {
  var svg_college = d3.select("#chart-college");
  var svg_grad = d3.select("#chart-grad");
  var svg_career = d3.select("#chart-career");
  var svg_gov = d3.select("#chart-gov");
  var svg_list = [svg_college, svg_grad, svg_career, svg_gov];
  // Define universal margins - first setting to figure out margins for the 2 views
  var margin_top = margin_bottom = 10;
  var margin_btwnCol = 15;
  var compViewLabels = 0;
  var w_labels = 105;
  var circleRadius = 5;
  var circleSpace = 12;
  var maxDots = 219;
  var w = d3.min([900, document.getElementById("chart").getBoundingClientRect().width], function(d) { return d; });
  var margin_right, margin_left, circlesPerRowMax, circlesPerCol,circlesPerRow;
  // Colors
  var green = d3.color("#377668");
  var experienceColor = d3.color("#A45A25"); // brown
  var repColor = "black";
  var stateColor = d3.color("#743D47"); // yellow
  // Topline orders
  var toplineOrder_college = getOrder(dataset_counts.slice(0,4));
  var toplineOrder_grad = getOrder(dataset_counts.slice(4,8));
  var toplineOrder_career = getOrder(dataset_counts.slice(8,23));
  var toplineOrder_gov = getOrder(dataset_counts.slice(23,28));
  var currExp, currState, currRep, currValue, currView, currRepName, currMenu;

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // Create groups
    for (var i=0; i<4; i++) {
      svg_list[i].append("g").attr("id", "labelGroup");
      svg_list[i].append("g").attr("id", "col1");
      svg_list[i].append("g").attr("id", "col2");
      // Column 1 label
      svg_list[i].select("#col1").append("text").attr("class", "bigLabels").attr("id", "col1label");
      svg_list[i].select("#col2").append("text").attr("class", "bigLabels").attr("id", "col2label");
    };
    // Create big labels
    var dataset_labels = ["COLLEGE", "GRADUATE SCHOOL", "CAREER", "POLITICAL OFFICE"];

    // College experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg_college.select("#col1")
                  .selectAll("collegeDots")
                  .data(dataset_ind.filter(function(d) { return d[toplineOrder_college[j]]==1; }))
                  .enter()
                  .append("circle")
                  .attr("class", "memberDots")
                  .attr("id", function(d) { return toplineOrder_college[j]; })
                  .attr("r", circleRadius);
    };
    // Create labels
    svg_college.select("#labelGroup")
                .selectAll("labels")
                .data(["Public school", "Private school", "Elite school", "No Bachelor's degree"])
                .enter()
                .append("text")
                .attr("class", "smallLabels")
                .attr("id", "collegeSmallLabels");

    // Graduate school experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg_grad.select("#col1")
              .selectAll("gradDots")
              .data(dataset_ind.filter(function(d) { return d[toplineOrder_grad[j]]==1; }))
              .enter()
              .append("circle")
              .attr("class", "memberDots")
              .attr("id", function(d) { return toplineOrder_grad[j]; })
              .attr("r", circleRadius);
    };
    // Create labels
    svg_grad.select("#labelGroup")
            .selectAll("labels")
            .data(["Law school", "Masters", "Medical school", "Doctorate"])
            .enter()
            .append("text")
            .attr("class", "smallLabels")
            .attr("id", "gradSmallLabels");

    // Career
    // Create dots
    for (var j=0; j<15; j++) {
      svg_career.select("#col1")
                .selectAll("workDots")
                .data(dataset_ind.filter(function(d) { return d[toplineOrder_career[j]]==1; }))
                .enter()
                .append("circle")
                .attr("class", "memberDots")
                .attr("id", function(d) { return toplineOrder_career[j]; })
                .attr("r", circleRadius);
    };
    // Create labels
    svg_career.select("#labelGroup")
              .selectAll("labels")
              .data(["Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader"])
              .enter()
              .append("text")
              .attr("class", "smallLabels")
              .attr("id", "careerSmallLabels");

    // Government
    for (var j=0; j<5; j++) {
      svg_gov.select("#col1")
              .selectAll("govDots")
              .data(dataset_ind.filter(function(d) { return d[toplineOrder_gov[j]]==1; }))
              .enter()
              .append("circle")
              .attr("class", "memberDots")
              .attr("id", function(d) { return toplineOrder_gov[j]; })
              .attr("r", circleRadius);
    };
    svg_gov.select("#labelGroup")
            .selectAll("labels")
            .data(["State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"])
            .enter()
            .append("text")
            .attr("class", "smallLabels")
            .attr("id", "govSmallLabels");
  }; // end setup
  function reset() {
    jQuery(window).scrollTop(0);
    currValue = "";
    currView = "total";
    currExp = currState = currRep = false;
  }; // end reset function
  function resize() {
    // Get new dimensions
    if (currView == "total") { // if total view (one column)
      w = d3.min([900, document.getElementById("chart").getBoundingClientRect().width], function(d) { return d; });
      circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
      circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
      circlesPerRow = Math.ceil(maxDots/circlesPerCol);
      margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2; // margins for the first column
    }
    else { // if comp view (double column)
      w = d3.min([900, document.getElementById("chart").getBoundingClientRect().width], function(d) { return d; });
      var columnWidth = (w - 10 - w_labels - margin_btwnCol - 10)/2; // width for the two columns with circles
      circlesPerRowMax = Math.floor(columnWidth/circleSpace); // min left and right margins = 10
      circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
      circlesPerRow = Math.ceil(maxDots/circlesPerCol);
      margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace*2 - margin_btwnCol)/2;
      compViewLabels = 20;
      d3.selectAll("#col1label")
        .attr("x", columnWidth/2);
      // Column 2 label
      d3.selectAll("#col2label")
        .attr("x", columnWidth/2);
      d3.selectAll("#col2").attr("transform", "translate(" + (margin_left + w_labels + columnWidth + margin_btwnCol) + "," + (margin_top) + ")");
    };
    // recalculate heights
    document.getElementById("chart-college").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-grad").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-career").style.height = margin_top + (circlesPerCol*circleSpace + 10)*15 + margin_bottom + compViewLabels;
    document.getElementById("chart-gov").style.height = margin_top + (circlesPerCol*circleSpace + 10)*5 + margin_bottom + compViewLabels;

    // move groups
    d3.selectAll("#labelGroup").attr("transform", "translate(" + margin_left + "," + (margin_top) + ")");
    d3.selectAll("#col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + (margin_top) + ")");
    resizeLabels(); // resize labels
    adjustAccordionHeight(); // adjust accordion height
    // resize dots
    // College
    for (var j=0; j<4; j++) {
      svg_college.select("#col1")
                 .selectAll("#"+toplineOrder_college[j])
                 .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      if (currView != "total") {
        svg_college.select("#col2")
                   .selectAll("#"+toplineOrder_college[j])
                   .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                   .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      };
    };
    // Grad
    for (var j=0; j<4; j++) {
      svg_grad.select("#col1")
              .selectAll("#"+toplineOrder_grad[j])
              .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
              .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      if (currView != "total") {
        svg_grad.select("#col2")
                .selectAll("#"+toplineOrder_grad[j])
                .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      };
    };
    // Career
    for (var j=0; j<15; j++) {
      svg_career.select("#col1")
                .selectAll("#"+toplineOrder_career[j])
                .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      if (currView != "total") {
        svg_career.select("#col2")
                  .selectAll("#"+toplineOrder_career[j])
                  .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                  .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      };
    };
    // Gov
    for (var j=0; j<5; j++) {
      svg_gov.select("#col1")
             .selectAll("#"+toplineOrder_gov[j])
             .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
             .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      if (currView != "total") {
        svg_gov.select("#col2")
               .selectAll("#"+toplineOrder_gov[j])
               .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
               .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
      };
    };
  };
  function resizeLabels() {
    d3.selectAll("#collegeSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i + compViewLabels; })
        .call(wrap, w_labels-20);
    d3.selectAll("#gradSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i + compViewLabels; })
        .call(wrap, w_labels-20);
    d3.selectAll("#careerSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i + compViewLabels; })
        .call(wrap, w_labels-20);
    d3.selectAll("#govSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i + compViewLabels; })
        .call(wrap, w_labels-20);
  }; // end resizelabels
  /////////////////////////////////////////////////////////////////////////////
  // Helper functions
  function dotMouseover(currDot) {
    var svgNode = "#" + currDot.node().parentNode.parentNode.id;
    var parentNode = "#" + currDot.node().parentNode.id;
    var currX = parseInt(currDot.attr("cx"));
    var currY = parseInt(currDot.attr("cy"));
    var compX = parseInt(currX + d3.select(parentNode).node().getBoundingClientRect().x);
    // style changes
    currDot.style("fill", repColor);
    // tooltip
    var overflowMargin = w-130;
    d3.select(svgNode).select(parentNode)
        .append("text")
        .attr("class", "mouseover_text")
        .attr("id", "mouseover_name")
        .text(function() { return currDot.data()[0].full_name; })
        .attr("x", function() {
          if (compX >= overflowMargin) { return currX-15; }
          else { return currX+15; }
        })
        .attr("y", currY+10)
        .style("text-anchor", function() {
          if (compX >= overflowMargin) { return "end"; }
          else { return "start"; }
        });
    d3.select(svgNode).select(parentNode)
       .append("text")
       .attr("class", "mouseover_text")
       .text(function() { return "(" + currDot.data()[0].state + ")"; })
       .attr("x", function() {
         if (compX >= overflowMargin) { return currX-15; }
         else { return currX+15; }
       })
       .attr("y", currY+25)
       .style("text-anchor", function() {
         if (compX >= overflowMargin) { return "end"; }
         else { return "start"; }
       });
    var mouseoverTextWidth = d3.select("#mouseover_name").node().getBoundingClientRect().width;
    d3.select(svgNode).select(parentNode)
        .append("rect")
        .attr("class", "mouseover_back")
        .attr("x", function() {
          if (compX >= overflowMargin) { return currX-20-mouseoverTextWidth; }
          else { return currX+10; }
        })
        .attr("y", currY)
        .attr("width", mouseoverTextWidth + 10)
        .attr("height", 30)
        .style("fill", "white")
        .style("opacity", 0.9);
    d3.selectAll(".mouseover_text").moveToFront();
  }; // end dotMouseover function
  function dotMouseout(currDot) {
    currDot.style("fill", function(d) {
      if (currRep & d.full_name == currRepName) { return repColor; }
      else if (currExp & d[currValue] == 1) { return experienceColor; }
      else if (currState & d.state == currValue) { return stateColor; }
      else { return green; }
    });
    d3.selectAll(".mouseover_text").remove();
    d3.selectAll(".mouseover_back").remove();
  }; // end dotMouseout function
  function dotClick(currDot) {
    colorDots(); // color back to what it was before
    currRep = true;
    currRepName = currDot.data()[0].full_name;
    d3.selectAll(".memberDots")
      .filter(function(d) { return d.full_name == currRepName; })
      .style("fill", repColor);
  }; // end dotClick function
  function getOrder(counts_data) { // This function gets the order of small labels based on count
    var sorted_data = counts_data.sort(function(a,b) { return b.count-a.count; });
    var sorted_exp = [];
    for (var i=0; i<sorted_data.length; i++) {
      sorted_exp.push(sorted_data[i].experience);
    }
    return(sorted_exp);
  }; // end getOrder
  function convertLabelToVariable(smallLabel) { // converts small label text to variable names
    var labels = ["Public school", "Private school", "Elite school", "No Bachelor's degree","Law school", "Masters", "Medical school", "Doctorate","Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader","State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"];
    var varNames = ["college_public","college_private","college_elite","college_none","edu_law", "edu_masters", "edu_med", "edu_doctorate", "work_business", "work_privatelaw", "work_military", "work_education", "work_nonprofits", "work_medicine", "work_realestate", "work_farming", "work_media", "work_lobbying", "work_bluecollar", "work_science", "work_lawenforcement", "work_sports", "work_religiousleader", "gov_stateleg", "gov_local", "gov_none", "gov_fedstate", "gov_publiclawyerjudge"];
    return varNames[labels.indexOf(smallLabel)];
  }; // end convertLabelToVariable
  function updateDots(colGroup, dataset) {
    // College
    for (var j=0; j<4; j++) {
      var collegeDots = svg_college.select(colGroup)
                                   .selectAll("#"+toplineOrder_college[j])
                                   .data(dataset.filter(function(d) { return d[toplineOrder_college[j]]==1; }));
      collegeDots.exit().remove();
      var collegeDotsEnter = collegeDots.enter()
                                        .append("circle")
                                        .attr("class", "memberDots")
                                        .attr("id", function(d) { return toplineOrder_college[j]; })
                                        .attr("r", circleRadius);
      collegeDots = collegeDots.merge(collegeDotsEnter);
      collegeDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
    };
    // Grad
    for (var j=0; j<4; j++) {
      var gradDots = svg_grad.select(colGroup)
                             .selectAll("#"+toplineOrder_grad[j])
                             .data(dataset.filter(function(d) { return d[toplineOrder_grad[j]]==1; }));
      gradDots.exit().remove();
      var gradDotsEnter = gradDots.enter()
                                  .append("circle")
                                  .attr("class", "memberDots")
                                  .attr("id", function(d) { return toplineOrder_grad[j]; })
                                  .attr("r", circleRadius);
      gradDots = gradDots.merge(gradDotsEnter);
      gradDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
    };
    // Career
    for (var j=0; j<15; j++) {
      var careerDots = svg_career.select(colGroup)
                                 .selectAll("#"+toplineOrder_career[j])
                                 .data(dataset.filter(function(d) { return d[toplineOrder_career[j]]==1; }));
      careerDots.exit().remove();
      var careerDotsEnter = careerDots.enter()
                                      .append("circle")
                                      .attr("class", "memberDots")
                                      .attr("id", function(d) { return toplineOrder_career[j]; })
                                      .attr("r", circleRadius);
      careerDots = careerDots.merge(careerDotsEnter);
      careerDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
    };
    // Gov
    for (var j=0; j<5; j++) {
      var govDots = svg_gov.select(colGroup)
                           .selectAll("#"+toplineOrder_gov[j])
                           .data(dataset.filter(function(d) { return d[toplineOrder_gov[j]]==1; }));
      govDots.exit().remove();
      var govDotsEnter = govDots.enter()
                                .append("circle")
                                .attr("class", "memberDots")
                                .attr("id", function(d) { return toplineOrder_gov[j]; })
                                .attr("r", circleRadius);
      govDots = govDots.merge(govDotsEnter);
      govDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol) + compViewLabels; });
    };
    // Mouseover feature
    d3.selectAll(".memberDots")
       .on("mouseover", function() {
         dotMouseover(d3.select(this));
       })
       .on("mouseout", function() {
         dotMouseout(d3.select(this));
       })
       .on("click", function() {
         dotClick(d3.select(this));
       });
  }; // end updateDots
  function colorDots() {
    d3.selectAll(".memberDots")
       .style("fill", function(d) {
         if (currExp & d[currValue] == 1) { return experienceColor; }
         else if (currState & d.state == currValue) { return stateColor; }
         else { return green; }
       });
  }; // end colorDots
  function defaultColors() {
    d3.selectAll(".memberDots").style("fill", green);
    d3.selectAll(".smallLabels").style("fill", "black").style("font-weight", 400); // change small labels back to all black
  }; // end defaultColors
  function clickSmallLabels(smallLabel) { // When a small label is clicked...
    // Change all dots to green and labels to black initially
    d3.selectAll(".smallLabels")
       .style("fill", "black")
       .style("font-weight", 400);
    d3.selectAll(".memberDots").style("fill", green);

    currValue = convertLabelToVariable(smallLabel); // find var name of small label text
    currState = currRep = false;
    currExp = true;
    // Change styles of labels
    var selection = d3.selectAll(".smallLabels").filter(function(d) { return d==smallLabel; });
    var currText = selection.text();
    selection.style("font-weight", 500)
             .style("fill", experienceColor);

    // Update dots
    if (currView == "total") {
      updateDots("#col1", dataset_ind.sort(function(a,b) { return b[currValue]-a[currValue]; }));
    }
    else {
      // Assign datasets
      if (currView == "party") {
        var dataset_col1 = dataset_ind.filter(function(d) { return d.party == "Democrat"; });
        var dataset_col2 = dataset_ind.filter(function(d) { return d.party == "Republican"; });
      }
      else {
        var dataset_col1 = dataset_ind.filter(function(d) { return d.new == 0; });
        var dataset_col2 = dataset_ind.filter(function(d) { return d.new == 1; });
      }
      updateDots("#col1", dataset_col1.sort(function(a,b) { return b[currValue]-a[currValue]; })); // update col 1
      updateDots("#col2", dataset_col2.sort(function(a,b) { return b[currValue]-a[currValue]; })); // update col 2
    }; // end updating columns
    colorDots();
  }; // end click function
  function changeButtonStyle(button) {
    button.style("background-color", green)
          .style("color", "white")
          .style("border", "none");
    if (button.attr("value") == "party") { defaultButtonStyle(d3.select("#button-year")); }
    else { defaultButtonStyle(d3.select("#button-party")); }
  }; // end changeButtonStyle
  function defaultButtonStyle(button) {
    button.style("background-color", "white")
          .style("color", "black")
          .style("border", "1.5px solid");
  }; // end defaultButtonStyle
  function comparisonView(type) {
    // Dimensions for column 1
    if (type == "party") {
      maxDots = 119;
      var dataset_col1 = dataset_ind.filter(function(d) { return d.party == "Democrat"; });
      var dataset_col2 = dataset_ind.filter(function(d) { return d.party == "Republican"; });
    }
    else {
      maxDots = 164;
      var dataset_col1 = dataset_ind.filter(function(d) { return d.new == 0; });
      var dataset_col2 = dataset_ind.filter(function(d) { return d.new == 1; });
    }
    var columnWidth = (w - 10 - w_labels - margin_btwnCol - 10)/2; // width for the two columns with circles
    circlesPerRowMax = Math.floor(columnWidth/circleSpace); // min left and right margins = 10
    circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
    circlesPerRow = Math.ceil(maxDots/circlesPerCol);
    margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace*2 - margin_btwnCol)/2;
    compViewLabels = 20;
    // re-calculate height
    document.getElementById("chart-college").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-grad").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-career").style.height = margin_top + (circlesPerCol*circleSpace + 10)*15 + margin_bottom + compViewLabels;
    document.getElementById("chart-gov").style.height = margin_top + (circlesPerCol*circleSpace + 10)*5 + margin_bottom + compViewLabels;
    adjustAccordionHeight(); // adjust accordion heights

    // Move groups
    d3.selectAll("#labelGroup").attr("transform", "translate(" + margin_left + "," + (margin_top) + ")");
    // column 1
    d3.selectAll("#col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + (margin_top) + ")");
    updateDots("#col1", dataset_col1);
    // column 2
    d3.selectAll("#col2").attr("transform", "translate(" + (margin_left + w_labels + columnWidth + margin_btwnCol) + "," + (margin_top) + ")");
    updateDots("#col2", dataset_col2);
    // Resize Labels
    resizeLabels();
    // Column 1 label
    d3.selectAll("#col1label")
      .text(function() {
        if (type == "party") { return "Democrats"; }
        else { return "Joined before 2019"; }
      })
      .attr("x", columnWidth/2)
      .attr("y", 0);
    // Column 2 label
    d3.selectAll("#col2label")
      .text(function() {
        if (type == "party") { return "Republicans"; }
        else { return "Joined in 2019"; }
      })
      .attr("x", columnWidth/2)
      .attr("y", 0);
  }; // end comparisonView
  function totalView() {
    // change styles
    d3.select("#button-total").style("display", "none"); // make button disappear
    defaultButtonStyle(d3.select("#button-party"));
    defaultButtonStyle(d3.select("#button-year")); // turn off highlighting other buttons
    defaultColors();

    currView = "total";
    d3.selectAll("#col2").selectAll(".memberDots").remove(); // remove col2
    d3.select(".comp-labels").style("display", "none");
    // Margins
    maxDots = 219;
    circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
    circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
    circlesPerRow = Math.ceil(maxDots/circlesPerCol);
    margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2; // margins for the first column
    compViewLabels = 0;
    document.getElementById("chart-college").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-grad").style.height = margin_top + (circlesPerCol*circleSpace + 10)*4 + margin_bottom + compViewLabels;
    document.getElementById("chart-career").style.height = margin_top + (circlesPerCol*circleSpace + 10)*15 + margin_bottom + compViewLabels;
    document.getElementById("chart-gov").style.height = margin_top + (circlesPerCol*circleSpace + 10)*5 + margin_bottom + compViewLabels;
    adjustAccordionHeight(); // adjust accordion height
    // move groups
    d3.selectAll("#labelGroup").attr("transform", "translate(" + margin_left + "," + (margin_top) + ")");
    d3.selectAll("#col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + (margin_top) + ")");
    defaultColors();
    // adjust labels
    resizeLabels();
    d3.selectAll("#col1label").text("");
    d3.selectAll("#col2label").text("");
    updateDots("#col1", dataset_ind);
  }; // end totalView
  function wrap(text, width) { // text wrapping function
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
  d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
  }; // end moveToFront function
  function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
    var currentFocus;
  /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.style.width = d3.select(".searchbar-input").style("width"); // fix width of list/items THIS IS ASSUMING STATE AND REP ARE SAME WIDTH
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:
              Run update on graphic */
              closeAllLists();
              if (arr == statesList) {
                searchState(inp.value);
              }
              else {
                searchRep(inp.value);
              }
              inp.value="";
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          save old variable
          increase the currentFocus variable:*/
          old = currentFocus;
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.backgroundColor = d3.color("#fff");
            x[old].style.color = "black";
          }
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          old = currentFocus;
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.backgroundColor = d3.color("#fff");
            x[old].style.color = "black";
          }
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    }); // end add event listener
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
      x[currentFocus].style.color = "white";
      x[currentFocus].style.backgroundColor = green;
    }; // end addActive
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }; // end removeActive
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }; // end closeAllLists
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }; // end autocomplete
  function adjustAccordionHeight() { // adjust the height of how much panel to show. This is impt when it goes from comp view to total view
    var accordions = jQuery(".accordion");
    for (var i=0; i<accordions.length; i++) {
      var panel = accordions[i].nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = panel.scrollHeight + "px";
        resizeLabels();
      }
    }
  }; // end adjustAccordionHeight
  function display(type) {
    d3.selectAll(".subsection-chart").style("display", "inline");
    currRep = currExp = currState = false;
    totalView();
    // Update dots
    if (type=="data") {
      d3.select("#options-data").style("display", "block");
      d3.selectAll(".sectionText").style("display", "none");
    }
    else {
      d3.select("#options-data").style("display", "none");
      d3.selectAll(".sectionText").style("display", "block");
    };
    // Accordion
    var accordions = jQuery(".accordion");
    for (var i=0; i<accordions.length; i++) {
      accordions[i].classList.remove("active");
      accordions[i].nextElementSibling.style.maxHeight = null;
    };
    // College accordion always active at first
    accordions[0].nextElementSibling.style.maxHeight = accordions[0].nextElementSibling.scrollHeight + "px";
    accordions[0].classList.toggle("active");

    // Labels on click feature
    d3.selectAll(".smallLabels")
       .on("click", function() {
         clickSmallLabels(d3.select(this).data()[0]);
       });
  };// end display()

  ////////////////////////////////////////////////////////////////////////////////
  reset();
  setup();
  currMenu = "essay";
  display(currMenu); // initial view
  window.addEventListener("resize", resize);

  ////////////////////////////////////////////////////////////////////////////////
  // NAVIGATION
  // Visual essay links
  d3.selectAll("#link_party").on("mouseover", function() {
    currView = "party";
    currRep = currExp = currState = false;
    var currButton = d3.select("#button-party");
    // Change styles
    changeButtonStyle(currButton); // button style
    d3.select("#button-total").style("display", "inline"); // show total button
    defaultColors();
    comparisonView("party");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  d3.selectAll("#link_year").on("mouseover", function() {
    currView = "year";
    currRep = currExp = currState = false;
    var currButton = d3.select("#button-year");
    // Change styles
    changeButtonStyle(currButton); // button style
    d3.select("#button-total").style("display", "inline"); // show total button
    defaultColors();
    comparisonView("year");
    jQuery("a").removeClass("clicked");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  d3.select("#link_collegeNoneTotal").on("mouseover", function() {
    clickSmallLabels("No Bachelor's degree");
    jQuery("a").removeClass("clicked");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  d3.select("#link_gradMastersTotal").on("mouseover", function() {
    clickSmallLabels("Masters");
    jQuery("a").removeClass("clicked");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  d3.select("#link_repHenryCuellar").on("mouseover", function() {
    currRep = true;
    currExp = currState = false;
    currRepName = "Henry Cuellar";
    d3.selectAll(".memberDots")
       .style("fill", function(d) {
         if (d.full_name == currRepName) { return repColor; }
         else { return green; }
       });
    jQuery("a").removeClass("clicked");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  d3.select("#link_govState").on("mouseover", function() {
    clickSmallLabels("State legislature");
    jQuery("a").removeClass("clicked");
    this.classList.toggle("clicked");
  }).on("mouseout", function() {
    jQuery("a").removeClass("clicked");
    totalView();
  });
  // Accordion
  var accordions = jQuery(".accordion");
  for (var i=0; i<accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) { // if hiding panel
        this.classList.remove("active");
        panel.style.maxHeight = null;
      }
      else { // showing panel
        if (currMenu=="essay") { // automatically hide other panels if it's for the essay
          for (var j=0; j<accordions.length; j++) {
            accordions[j].nextElementSibling.style.maxHeight = null;
            accordions[j].classList.remove("active");
          }
          reset();
          colorDots();
        }
        this.classList.toggle("active");
        panel.style.maxHeight = panel.scrollHeight + "px"; // show the panel clicked on
      }
    })
  }; // end for loop
  // State search bar
  var statesList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  var statesAbbrevList = ['AL','AK','AZ','AR','CA','CO','CT','DL','DC','FL','GA','HI','ID','IL','IN','IA','KS','KT','LA','MA','MD','MA','MI','MN','MS','MO','MN','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  autocomplete(document.getElementById("searchbar-state"), statesList); // autocomplete function
  function searchState(state) {
    currValue = statesAbbrevList[statesList.indexOf(state)];
    currState = true;
    currRep = currExp = false;
    defaultColors();
    if (currView == "total") {
      updateDots("#col1", dataset_ind.sort(function(a,b) { return (b.state==currValue) - (a.state==currValue); }));
    }
    else {
      // Assign datasets
      if (currView == "party") {
        var dataset_col1 = dataset_ind.filter(function(d) { return d.party == "Democrat"; });
        var dataset_col2 = dataset_ind.filter(function(d) { return d.party == "Republican"; });
      }
      else {
        var dataset_col1 = dataset_ind.filter(function(d) { return d.new == 0; });
        var dataset_col2 = dataset_ind.filter(function(d) { return d.new == 1; });
      }
      updateDots("#col1", dataset_col1.sort(function(a,b) { return (b.state==currValue) - (a.state==currValue); })); // update col 1
      updateDots("#col2", dataset_col2.sort(function(a,b) { return (b.state==currValue) - (a.state==currValue); })); // update col 2
    }; // end updating columns
    colorDots();
  }; // end searchState;

  // Representatives search bar
  var repsList = [];
  for (var i=0; i<dataset_ind.length; i++) {
    repsList.push(dataset_ind[i].full_name);
  };
  autocomplete(document.getElementById("searchbar-rep"), repsList); // autocomplete function
  function searchRep(rep) {
    colorDots();
    currRep = true;
    currRepName = rep;
    d3.selectAll(".memberDots")
       .filter(function(d) { return d.full_name == currRepName; })
       .style("fill", repColor);
  }; // end searchRep

  // Side-by-side comparison button clicks
  // Party
  d3.select("#button-party").on("click", function() {
    currView = "party";
    currRep = currExp = currState = false;
    var currButton = d3.select(this);
    // Change styles
    changeButtonStyle(currButton); // button style
    d3.select("#button-total").style("display", "inline"); // show total button
    defaultColors();
    // update dots and view
    comparisonView("party");
  });
  // Year joined
  d3.select("#button-year").on("click", function() {
    currView = "year";
    currRep = currExp = currState = false;
    var currButton = d3.select(this);
    // change styles
    changeButtonStyle(currButton); // button style
    defaultColors();
    d3.select("#button-total").style("display", "inline");// show total button
    // update dots and view
    comparisonView("year");
  });
  // Total button
  d3.select("#button-total").on("click", function() {
    currRep = currExp = currState = false;
    // Update dots
    totalView();
  });

  // Read the story vs. explore data
  d3.select("#button-essay").on("click", function() {
    currMenu = "essay";
    display(currMenu);
    // Update button style
    d3.select(this).style("background-color", green)
                   .style("color", "white")
                   .style("border", "none");
    defaultButtonStyle(d3.select("#button-data"));
  });
  d3.select("#button-data").on("click", function() {
    currMenu = "data";
    reset();
    display(currMenu);
    // Update button
    d3.select(this).style("background-color", green)
                   .style("color", "white")
                   .style("border", "none");
    defaultButtonStyle(d3.select("#button-essay"));
    // Scrolling and options sticky
    var optionsTop = jQuery("#options-data").position().top + jQuery("#options-data").height();
    var optionsWidth = jQuery("#options-data").width();
    jQuery(window).scroll(function() {
      // init sticky options
      var scrollVal = jQuery(this).scrollTop();
      if (scrollVal >= optionsTop) {
        jQuery("#options-data").addClass("stuck").css("width", optionsWidth).css("margin-left", optionsWidth*-1/2).css("left", "50%");
      }
      else {
        jQuery("#options-data").removeClass("stuck").css("margin", "auto").css("left", 0);
      }
    })
  }); // end on click
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
    gender: d.gender,
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
  });
});
