function init() {
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
  var experienceColor = d3.color("#A45A25");
  var stateColor = d3.color("#D1A730");
  // Topline orders
  var toplineOrder_college = getOrder(dataset_counts.slice(0,4));
  var toplineOrder_grad = getOrder(dataset_counts.slice(4,8));
  var toplineOrder_career = getOrder(dataset_counts.slice(8,23));
  var toplineOrder_gov = getOrder(dataset_counts.slice(23,28));
  var currVar;

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // FIRST VIEW: One column
    // Create big labels
    var dataset_labels = ["COLLEGE", "GRADUATE SCHOOL", "CAREER", "POLITICAL OFFICE"];
    svg.selectAll(".gBigLabels")
        .data(dataset_labels)
        .enter()
        .append("text")
        .attr("class", "bigLabels")
        .attr("x", margin_left)
        .attr("y", function(d,i) {
          if (i==0) { return margin_top + 10; }
          else if (i==1) { return margin_top + h_bigLabels + (circlesPerCol*circleSpace + 10)*4 + margin_btwn; }
          else if (i==2) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2; }
          else if (i==3) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3; }
        })
        .text(function(d) { return d; });

    // College experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg.selectAll("collegeDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_college[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_college[j]; })
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.selectAll("labels")
        .data(["Public school", "Private school", "Elite school", "No Bachelor's degree"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Graduate school experience
    // Create dots
    for (var j=0; j<4; j++) {
      svg.selectAll("gradDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_grad[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_grad[j]; })
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.selectAll("labels")
        .data(["Law school", "Masters", "Medical school", "Doctorate"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Career
    // Create dots
    for (var j=0; j<15; j++) {
      svg.selectAll("workDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_career[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_career[j]; })
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    // Create labels
    svg.selectAll("labels")
        .data(["Business/ management","Private law","Military","Education","Nonprofits & unions","Medicine", "Real estate","Farming/ ranching","Media", "Lobbying/ activism","Blue-collar/ service job","Science/ engineering","Law enforcement","Sports","Religious leader"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
        .call(wrap, w_labels-20);

    // Government
    for (var j=0; j<5; j++) {
      svg.selectAll("govDots")
          .data(dataset_ind.filter(function(d) { return d[toplineOrder_gov[j]]==1; }))
          .enter()
          .append("circle")
          .attr("class", "memberDots")
          .attr("id", function(d) { return toplineOrder_gov[j]; })
          .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
          .attr("cy", function(d,i) { return margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); })
          .attr("r", circleRadius);
    };
    svg.selectAll("labels")
        .data(["State legislature","Local government","No previous office","Federal or state office","Public lawyer or judge"])
        .enter()
        .append("text")
        .attr("class", "smallLabels")
        .text(function(d) { return d; })
        .attr("x", margin_left)
        .attr("y", function(d,i) { return margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + circleSpace*(circlesPerCol/3) + (10 + circleSpace*circlesPerCol)*i; })
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
       })

  }; // end setup
  function reset() {
    currVar = "";
  }; // end reset function
  function resize() {

  }; // end resize function
  ////////////////////////////////////////////////////////////////////////////////
  // Helper functions
  function dotMouseover(currDot) {
    var currX = parseInt(currDot.attr("cx"));
    var currY = parseInt(currDot.attr("cy"));
    // style changes
    currDot.style("fill", "black");
    // tooltip
    svg.append("rect")
        .attr("class", "mouseover_back")
        .attr("x", currX+10)
        .attr("y", currY)
        .attr("width", 100)
        .attr("height", 20)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "mouseover_text")
        .text(function() { return currDot.data()[0].full_name + " (" + currDot.data()[0].state + ")"; })
        .attr("x", currX+15)
        .attr("y", currY+10)
        .call(wrap, 95);
  }; // end dotMouseover function
  function dotMouseout(currDot) {
    currDot.style("fill", function(d) {
      if (d[currVar] == 1) { return experienceColor; }
      else if (d.state == currVar) { return stateColor; }
      else { return green; }
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
  function updateDots(currVar, type) {
    if (type == 'experience') {
      var dataset_sorted = dataset_ind.sort(function(a,b) { return b[currVar]-a[currVar]; });
    }
    else {
      var stateAbbrev = statesAbbrevList[statesList.indexOf(currVar)];
      var dataset_sorted = dataset_ind.sort(function(a,b) { return (b.state==stateAbbrev) - (a.state==stateAbbrev); });
    };
    // College
    for (var j=0; j<4; j++) {
      svg.selectAll("#"+toplineOrder_college[j])
         .data(dataset_sorted.filter(function(d) { return d[toplineOrder_college[j]]==1; }))
         .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
         .attr("cy", function(d,i) { return margin_top + h_bigLabels + (10 + circleSpace*circlesPerCol)*j + circleSpace*(i%circlesPerCol); });
    };
    // Grad
    for (var j=0; j<4; j++) {
      svg.selectAll("#"+toplineOrder_grad[j])
         .data(dataset_sorted.filter(function(d) { return d[toplineOrder_grad[j]]==1; }))
         .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
         .attr("cy", function(d,i) { return margin_top + h_bigLabels*2 + (circlesPerCol*circleSpace + 10)*4 + margin_btwn + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Career
    for (var j=0; j<15; j++) {
      svg.selectAll("#"+toplineOrder_career[j])
         .data(dataset_sorted.filter(function(d) { return d[toplineOrder_career[j]]==1; }))
         .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
         .attr("cy", function(d,i) { return margin_top + h_bigLabels*3 + (circlesPerCol*circleSpace + 10)*8 + margin_btwn*2 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // Gov
    for (var j=0; j<5; j++) {
      svg.selectAll("#"+toplineOrder_gov[j])
         .data(dataset_sorted.filter(function(d) { return d[toplineOrder_gov[j]]==1; }))
         .attr("cx", function(d,i) { return margin_left + w_labels + circleSpace*Math.floor(i/circlesPerCol); })
         .attr("cy", function(d,i) { return margin_top + h_bigLabels*4 + (circlesPerCol*circleSpace + 10)*23 + margin_btwn*3 + (circlesPerCol*circleSpace + 10)*j + circleSpace*(i%circlesPerCol); });
    };
    // color the overlapped dots
    svg.selectAll(".memberDots")
       .style("fill", function(d) {
         if (type == "experience" & d[currVar] == 1) { return experienceColor; }
         else if (type == "state" & d.state == stateAbbrev) { return stateColor; }
         else { return green; }
       });
  }; // end updateDots
  function clickSmallLabels(smallLabel) { // When a small label is clicked...
    currVar = convertLabelToVariable(smallLabel); // find var name of small label text
    updateDots(currVar, "experience");
  }; // end click function
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
                filterByState(inp.value);//// TODO: FUNCTION TO UPDATE
                document.getElementById("searchbar-state").value="";
              }
              else {
                document.getElementById("searchbar-rep").value="";
              }
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
  ////////////////////////////////////////////////////////////////////////////////
  reset();
  setup();
  window.addEventListener("resize", resize);

  // State search bar
  var statesList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  var statesAbbrevList = ['AL','AK','AZ','AR','CA','CO','CT','DL','DC','FL','GA','HI','ID','IL','IN','IA','KS','KT','LA','MA','MD','MA','MI','MN','MS','MO','MN','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RH','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  autocomplete(document.getElementById("searchbar-state"), statesList); // autocomplete function
  function filterByState(state) {
    svg.selectAll(".smallLabels").style("fill", "black").style("font-weight", 400); // change small labels back to all black
    currVar = statesAbbrevList[statesList.indexOf(state)];
    updateDots(state, 'state');
  }; // end filterByState;

  // Representatives search bar
  var repsList = [];
  for (var i=0; i<dataset_ind.length; i++) {
    repsList.push(dataset_ind[i].full_name);
  };
  autocomplete(document.getElementById("searchbar-rep"), repsList); // autocomplete function

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
