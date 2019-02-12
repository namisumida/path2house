function init() {
  var svg = d3.select("#chart-svg");
  // Defining margins
  var w = document.getElementById("chart-svg").getBoundingClientRect().width;
  // Define universal margins - first setting to figure out margins for the 2 views
  var margin_top = margin_bottom = margin_btwn = 20;
  var margin_btwnCol = 15;
  var w_labels = 105;
  var circleRadius = 5;
  var circleSpace = 12;
  var circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
  var maxDots = 219;
  var circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
  var circlesPerRow = Math.ceil(maxDots/circlesPerCol);
  var h_bigLabels = 20;
  // adjusted margins
  var margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2; // margins for the first column
  // re-calculate height
  var h = margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*28 + margin_btwn*3 + margin_bottom;
  document.getElementById("chart-svg").style.height = h;
  // Colors
  var green = d3.color("#377668");
  var experienceColor = d3.color("#A45A25"); // brown
  var repColor = d3.color("#D1A730"); // yellow
  var stateColor = d3.color("#743D47"); // plum
  var stateDarkColor = d3.rgb(86,46,53); // dark plum
  var repLightColor = d3.rgb(227,128,115);
  var repColor = d3.color("#BF3B27");
  var repDarkColor = d3.rgb(143,44,28);
  var demLightColor = d3.rgb(133,167,190);
  var demColor = d3.color("#456A83");
  var demDarkColor = d3.rgb(51,79,98);
  // Topline orders
  var toplineOrder_college = getOrder(dataset_counts.slice(0,4));
  var toplineOrder_grad = getOrder(dataset_counts.slice(4,8));
  var toplineOrder_career = getOrder(dataset_counts.slice(8,23));
  var toplineOrder_gov = getOrder(dataset_counts.slice(23,28));
  var currExp, currState, currRep, currValue, currView;

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // FIRST VIEW: One column
    svg.append("g").attr("id", "labelGroup").attr("transform", "translate(" + margin_left + "," + margin_top + ")");
    svg.append("g").attr("id", "col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + margin_top + ")");
    svg.append("g").attr("id", "col2");

    // Column labels - no display for now
    svg.append("text") // Dems label
       .attr("class", "bigLabels")
       .attr("id", "col1label")
       .attr("y", margin_top)
       .style("text-anchor", "middle");
    svg.append("text") // Dems label
       .attr("class", "bigLabels")
       .attr("id", "col2label")
       .attr("y", margin_top)
       .style("text-anchor", "middle");
    // Create big labels
    var dataset_labels = ["COLLEGE", "GRADUATE SCHOOL", "CAREER", "POLITICAL OFFICE"];
    svg.select("#labelGroup")
        .selectAll(".gBigLabels")
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
    // Create dots
    for (var j=0; j<4; j++) {
      svg.select("#col1")
          .selectAll("collegeDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_college[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_college[j]; })
          .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.select("#labelGroup")
        .selectAll("labels")
        .data(["Public school", "Private school", "Elite school", "No Bachelor's degree"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .attr("id", "collegeSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Graduate school experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg.select("#col1")
          .selectAll("gradDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_grad[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_grad[j]; })
          .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.select("#labelGroup")
        .selectAll("labels")
        .data(["Law school", "Masters", "Medical school", "Doctorate"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .attr("id", "gradSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Career
    // Create dots
    for (var j=0; j<15; j++) {
      svg.select("#col1")
          .selectAll("workDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_career[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_career[j]; })
          .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.select("#labelGroup")
        .selectAll("labels")
        .data(["Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .attr("id", "careerSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Government
    for (var j=0; j<5; j++) {
      svg.select("#col1")
          .selectAll("govDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_gov[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_gov[j]; })
          .attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    svg.select("#labelGroup")
        .selectAll("labels")
        .data(["State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .attr("id", "govSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Mouseover feature
    svg.selectAll(".memberDots")
       .on("mouseover", function() {
         dotMouseover(d3.select(this));
       })
       .on("mouseout", function() {
         dotMouseout(d3.select(this));
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
                  .style("fill", experienceColor);
         clickSmallLabels(selection.data()[0]);
       });

  }; // end setup
  function reset() {
    currValue = "";
    currView = "total";
  }; // end reset function
  /*function resize() {
    // Labels
    svg.selectAll(".bigLabels")
        .attr("x", margin_left)
        .attr("y", function(d,i) {
          if (i==0) { return margin_top + 10; }
          else if (i==1) { return margin_top + h_bigLabels + (circlesPerCol*circleSpace + 10)*4 + margin_btwn; }
          else if (i==2) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2; }
          else if (i==3) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3; }
        });
    // College experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg.selectAll("#" + toplineOrder_college[j])
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); });
    };
    // Create labels
    svg.selectAll("#collegeSmallLabels")
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .text(function(d) { return d; })
        .call(wrap, w_labels-20);

    // Graduate school experience
    for (var j=0; j<4; j++) {
      svg.selectAll("#" +toplineOrder_grad[j])
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Create labels
    svg.selectAll("#gradSmallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Career
    // Create dots
    for (var j=0; j<15; j++) {
      svg.selectAll("#" + toplineOrder_career[j])
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Create labels
    svg.selectAll("#careerSmallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Government
    for (var j=0; j<5; j++) {
      svg.selectAll("#" + toplineOrder_gov[j])
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    svg.selectAll("#govSmallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);
  }; // end resize function */
  function resizeLabels() {
    svg.select("#labelGroup")
        .selectAll(".bigLabels")
        .attr("x", 0)
        .attr("y", function(d,i) {
          if (i==0) { return 10; }
          else if (i==1) { return h_bigLabels + (circlesPerCol*circleSpace + 10)*4 + margin_btwn; }
          else if (i==2) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2; }
          else if (i==3) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3; }
        });
    svg.select("#labelGroup")
        .selectAll("#collegeSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);
    svg.select("#labelGroup")
        .selectAll("#gradSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);
    svg.select("#labelGroup")
        .selectAll("#careerSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);
    svg.select("#labelGroup")
        .selectAll("#govSmallLabels")
        .text(function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);
  }; // end resizelabels
  /////////////////////////////////////////////////////////////////////////////
  // Helper functions
  function dotMouseover(currDot) {
    var parentNode = "#" + currDot.node().parentNode.id;
    var currX = parseInt(currDot.attr("cx"));
    var currY = parseInt(currDot.attr("cy"));
    // style changes
    currDot.style("fill", repColor);
    // tooltip
    svg.select(parentNode)
        .append("rect")
        .attr("class", "mouseover_back")
        .attr("x", currX+10)
        .attr("y", currY)
        .attr("width", 100)
        .attr("height", 20)
        .style("fill", "white");

    svg.select(parentNode)
        .append("text")
        .attr("class", "mouseover_text")
        .text(function() { return currDot.data()[0].full_name + " (" + currDot.data()[0].state + ")"; })
        .attr("x", currX+15)
        .attr("y", currY+10)
        .call(wrap, 95);
  }; // end dotMouseover function
  function dotMouseout(currDot) {
    currDot.style("fill", function(d) {
      if (d[currValue] == 1) { // experience
        if (currView == "party") {
          if (d.party == "Democrat") { return demDarkColor; }
          else { return repDarkColor; }
        }
        else { return experienceDarkColor; }
      }
      else if (d.state == currValue) { // state
        if (currView == "party") {
          if (d.party == "Democrat") { return demDarkColor; }
          else { return repDarkColor; }
        }
        else { return stateDarkColor; }
      }
      else if (d.full_name == currRep) {
        if (currView == "party") {
          if (d.party == "Democrat") { return demLightColor; }
          else { return repLightColor; }
        }
        else { return stateDarkColor; }
      }
      else {
        if (currView == "party") {
          if (d.party == "Democrat") { return demColor; }
          else { return repColor; }
        }
        else { return green; }
      }
    });
    svg.selectAll(".mouseover_text").remove();
    svg.selectAll(".mouseover_back").remove();
  }; // end dotMouseout function
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
      var collegeDots = colGroup.selectAll("#"+toplineOrder_college[j])
                                .data(dataset.filter(function(d) { return d[toplineOrder_college[j]]==1; }));
      collegeDots.exit().remove();
      var collegeDotsEnter = collegeDots.enter()
                                        .append("circle")
                                        .attr("class", "memberDots")
                                        .attr("id", function(d) { return toplineOrder_college[j]; })
                                        .attr("r", circleRadius);
      collegeDots = collegeDots.merge(collegeDotsEnter);
      collegeDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                 .attr("cy", function(d,i) { return h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); });
    };
    // Grad
    for (var j=0; j<4; j++) {
      var gradDots = colGroup.selectAll("#"+toplineOrder_grad[j])
                             .data(dataset.filter(function(d) { return d[toplineOrder_grad[j]]==1; }));
      gradDots.exit().remove();
      var gradDotsEnter = gradDots.enter()
                                  .append("circle")
                                  .attr("class", "memberDots")
                                  .attr("id", function(d) { return toplineOrder_grad[j]; })
                                  .attr("r", circleRadius);
      gradDots = gradDots.merge(gradDotsEnter);
      gradDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
              .attr("cy", function(d,i) { return h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Career
    for (var j=0; j<15; j++) {
      var careerDots = colGroup.selectAll("#"+toplineOrder_career[j])
                               .data(dataset.filter(function(d) { return d[toplineOrder_career[j]]==1; }));
      careerDots.exit().remove();
      var careerDotsEnter = careerDots.enter()
                                      .append("circle")
                                      .attr("class", "memberDots")
                                      .attr("id", function(d) { return toplineOrder_career[j]; })
                                      .attr("r", circleRadius);
      careerDots = careerDots.merge(careerDotsEnter);
      careerDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
                .attr("cy", function(d,i) { return h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Gov
    for (var j=0; j<5; j++) {
      var govDots = colGroup.selectAll("#"+toplineOrder_gov[j])
                            .data(dataset.filter(function(d) { return d[toplineOrder_gov[j]]==1; }));
      govDots.exit().remove();
      var govDotsEnter = govDots.enter()
                                .append("circle")
                                .attr("class", "memberDots")
                                .attr("id", function(d) { return toplineOrder_gov[j]; })
                                .attr("r", circleRadius);
      govDots = govDots.merge(govDotsEnter);
      govDots.attr("cx", function(d,i) { return circleSpace*Math.floor(i/circlesPerCol); })
             .attr("cy", function(d,i) { return h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Mouseover feature
    svg.selectAll(".memberDots")
       .on("mouseover", function() {
         dotMouseover(d3.select(this));
       })
       .on("mouseout", function() {
         dotMouseout(d3.select(this));
       });
  }; // end updateDots
  function colorDots() {
    svg.selectAll(".memberDots")
       .style("fill", function(d) {
         if (currExp & d[currValue] == 1) { return experienceColor; }
         else if (currState & d.state == currValue) { return stateColor; }
         else { return green; }
       });
  }; // end colorDots
  function clickSmallLabels(smallLabel) { // When a small label is clicked...
    currValue = convertLabelToVariable(smallLabel); // find var name of small label text
    currState, currRep = false;
    currExp = true;
    updateDots(d3.select("#col1"), dataset_ind.sort(function(a,b) { return b[currValue]-a[currValue]; }));
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
      var maxDots = 119;
      var dataset_col1 = dataset_ind.filter(function(d) { return d.party == "Democrat"; });
      var dataset_col2 = dataset_ind.filter(function(d) { return d.party == "Republican"; });
    }
    else {
      var maxDots = 164;
      var dataset_col1 = dataset_ind.filter(function(d) { return d.new == 0; });
      var dataset_col2 = dataset_ind.filter(function(d) { return d.new == 1; });
    }
    var columnWidth = (w - 10 - w_labels - margin_btwnCol - 10)/2; // width for the two columns with circles
    circlesPerRowMax = Math.floor(columnWidth/circleSpace); // min left and right margins = 10
    circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
    circlesPerRow = Math.ceil(maxDots/circlesPerCol);
    margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace*2 - margin_btwnCol)/2;
    h = margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*28 + margin_btwn*3 + margin_bottom;
    document.getElementById("chart-svg").style.height = h;

    // Move groups
    svg.select("#labelGroup").attr("transform", "translate(" + margin_left + "," + (margin_top + 15) + ")");
    // column 1
    svg.select("#col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + (margin_top + 15) + ")");
    updateDots(d3.select("#col1"), dataset_col1);
    svg.select("#col1")
       .selectAll(".memberDots")
       .style("fill", function() {
         if (type == "party") { return demColor; }
         else { return green; }
       });
    svg.select("#col1label").style("display", "inline"); // label
    svg.select("#col1label")
       .text(function() {
         if (type == "party") { return "Democrats"; }
         else { return "Joined before 2019"; }
       })
       .attr("x", function() {
         if (type == "party") { return margin_left + w_labels + 10*circleSpace; }
         else { return margin_left + w_labels + 14*circleSpace; }
       })
       .style("fill", function() {
         if (type == "party") { return demColor; }
         else { return "black"; }
       });
    // column 2
    svg.select("#col2").attr("transform", "translate(" + (margin_left + w_labels + columnWidth + margin_btwnCol) + "," + (margin_top + 15) + ")");
    updateDots(d3.select("#col2"), dataset_col2);
    svg.select("#col2") // dot colors
       .selectAll(".memberDots")
       .style("fill", function() {
         if (type == "party") { return repColor; }
         else { return green; }
       });
    svg.select("#col2label").style("display", "inline"); // labels
    svg.select("#col2label")
       .text(function() {
         if (type == "party") { return "Republicans"; }
         else { return "Joined in 2019"; }
       })
       .attr("x", function() {
         if (type == "party") { return margin_left + w_labels + columnWidth + margin_btwnCol + circlesPerRow*circleSpace/2; }
         else { return margin_left + w_labels + columnWidth + margin_btwnCol + 5*circleSpace; }
       })
       .style("fill", function() {
         if (type == "party") { return repColor; }
         else { return "black"; }
       });
    // Resize Labels
    resizeLabels();
  }; // end comparisonView
  function totalView() {
    svg.select("#col2").selectAll(".memberDots").remove();
    svg.select("#col1label").style("display", "none");
    svg.select("#col2label").style("display", "none");
    // move groups
    svg.select("#labelGroup").attr("transform", "translate(" + margin_left + "," + (margin_top) + ")");
    svg.select("#col1").attr("transform", "translate(" + (margin_left + w_labels) + "," + (margin_top) + ")");
    // update dot colors
    svg.selectAll(".memberDots").style("fill", green);
    // resize labels
    resizeLabels();
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
      x[currentFocus].style.color = "black";
      x[currentFocus].style.backgroundColor = stateColor;
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
  // State search bar
  var statesList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  var statesAbbrevList = ['AL','AK','AZ','AR','CA','CO','CT','DL','DC','FL','GA','HI','ID','IL','IN','IA','KS','KT','LA','MA','MD','MA','MI','MN','MS','MO','MN','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RH','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  autocomplete(document.getElementById("searchbar-state"), statesList); // autocomplete function
  function searchState(state) {
    svg.selectAll(".smallLabels").style("fill", "black").style("font-weight", 400); // change small labels back to all black
    currValue = statesAbbrevList[statesList.indexOf(state)];
    currState = true;
    currRep, currExp = false;
    updateDots(d3.select("#col1"), dataset_ind.sort(function(a,b) { return (b.state==currValue) - (a.state==currValue); }));
    colorDots();
  }; // end searchState;

  // Representatives search bar
  var repsList = [];
  for (var i=0; i<dataset_ind.length; i++) {
    repsList.push(dataset_ind[i].full_name);
  };
  autocomplete(document.getElementById("searchbar-rep"), repsList); // autocomplete function
  function searchRep(rep) {
    // Change back to default (or as before)
    svg.selectAll(".smallLabels").style("fill", "black").style("font-weight", 400); // change small labels back to all black
    svg.selectAll(".memberDots")
       .style("fill", function(d) {
         if (currExp & d[currValue] == 1) { return experienceColor; }
         else if (currState & d.state == currValue) { return stateColor; }
         else { return green; }
       });
    currRep = rep;
    svg.selectAll(".memberDots")
       .filter(function(d) { return d.full_name == rep; })
       .style("fill", repColor);
  }; // end searchRep

  // Side-by-side comparison button clicks
  // Party
  d3.select("#button-party").on("click", function() {
    currView = "party";
    var currButton = d3.select(this);
    changeButtonStyle(currButton); // change button style
    d3.select("#button-total").style("display", "inline"); // show total button
    comparisonView("party");
  });
  // Year joined
  d3.select("#button-year").on("click", function() {
    currView = "year";
    var currButton = d3.select(this);
    changeButtonStyle(currButton);
    d3.select("#button-total").style("display", "inline");// show total button
    comparisonView(currButton.value);
  });
  // Total button
  d3.select("#button-total").on("click", function() {
    currView = "total";
    d3.select(this).style("display", "none"); // make button disappear
    defaultButtonStyle(d3.selectAll("button"));
    // Margins
    maxDots = 219;
    circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
    maxDots = 219;
    circlesPerCol = Math.ceil(maxDots/circlesPerRowMax); // max number of members in one category
    circlesPerRow = Math.ceil(maxDots/circlesPerCol);
    margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2; // margins for the first column
    h = margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*28 + margin_btwn*3 + margin_bottom;
    document.getElementById("chart-svg").style.height = h;
    // Update dots
    totalView();
    updateDots(d3.select("#col1"), dataset_ind);
  });


  ////////////////////////////////////////////////////////////////////////////////
  reset();
  setup();
  window.addEventListener("resize", function() {
    w = document.getElementById("chart-svg").getBoundingClientRect().width;
    // margins
    circlesPerRowMax = Math.floor((w - w_labels - 20)/circleSpace); // min left and right margins = 10
    circlesPerCol = Math.ceil(219/circlesPerRowMax); // max number of members in one category
    circlesPerRow = Math.ceil(219/circlesPerCol);
    margin_left = margin_right = (w - w_labels - circlesPerRow*circleSpace)/2;
    h = margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*28 + margin_btwn*3 + margin_bottom;
    document.getElementById("chart-svg").style.height = h;
    resize();
  });
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
  })
});
