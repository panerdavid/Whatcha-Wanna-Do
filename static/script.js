// slideshow
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


// add event
function myFunc(){
    eventlst = [];
    var activities = document.forms["act"];
    console.log(activities);
    for (var i = 0; i < activities.length; i++) {
        if (activities[i].checked) {
            // console.log("check worked");
            var textlist = activities[i].value.split("//");
            console.log(i , textlist);
            var title = textlist[0].trim();
            var date = textlist[1].trim();
            var location = textlist[2].trim();
            var start = date.substring(0,5);
            var end = date.substring(6,date.length);
            var newt = timeslot(start, end);
            var dic = {
                start: newt[0],
                end: newt[1],
                title: title,
                loc: location
            };
            eventlst.push(dic);
            console.log(eventlst);
            layOutDay(eventlst);
        } else {
            layOutDay(eventlst);
        }
     }
}

function timeslot (start, end) {
    //return diff of start -> end in minutes
    var init = start.substring(0,2);
    var initdeci = start.substring(3,5);
    var final = end.substring(0,2);
    var finaldeci = end.substring(3,5);

    var initconv = parseInt(init) * 60 + parseFloat(initdeci) - 420;
    var finalconv = parseInt(final) * 60 + parseFloat(finaldeci) - 420;
    return [initconv, finalconv];
}


//from website!!!
//============================================
const containerHeight = 720;
// const containerHeight = 900;
// const containerWidth = 720;
const containerWidth = 600;
const minutesinDay = 60 * 17;
let collisions = [];
let width = [];
let leftOffSet = [];

// append one event to calendar
var createEvent = (height, top, left, units, title, loc) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML =
  "<span class='title'>"+ title +"</span> \
  <br><span class='location'>" + loc +"</span>";

  // Customized CSS to position each event
  node.style.width = ((containerWidth + 19)/units) + "px";
  node.style.height = height + "px";
  node.style.top = top + "px";
  // node.style.left = 233 + left + "px";
  node.style.left = left + "px";
  node.style.right = "10px";
  document.getElementById("events").appendChild(node);
}

/*
collisions is an array that tells you which events are in each 30 min slot
- each first level of array corresponds to a 30 minute slot on the calendar
  - [[0 - 30mins], [ 30 - 60mins], ...]
- next level of array tells you which event is present and the horizontal order
  - [0,0,1,2]
  ==> event 1 is not present, event 2 is not present, event 3 is at order 1, event 4 is at order 2
*/

function getCollisions (events) {

  //resets storage
  collisions = [];

  for (var i = 0; i < 36; i ++) {
    var time = [];
    for (var j = 0; j < events.length; j++) {
      time.push(0);
    }
    collisions.push(time);
  }

  events.forEach((event, id) => {
    let end = event.end;
    let start = event.start;
    let order = 1;

    while (start < end) {
      timeIndex = Math.floor(start/30);
      console.log(timeIndex);
      while (order < events.length) {
        if (collisions[timeIndex].indexOf(order) === -1) {
          break;
        }
        order ++;
      }
      console.log(collisions[timeIndex]);
      collisions[timeIndex][id] = order;
      start = start + 30;
    }

    collisions[Math.floor((end-1)/30)][id] = order;
  });
};

/*
find width and horizontal position
width - number of units to divide container width by
horizontal position - pixel offset from left
*/
function getAttributes (events) {

  //resets storage
  width = [];
  leftOffSet = [];

  for (var i = 0; i < events.length; i++) {
    width.push(0);
    leftOffSet.push(0);
  }
  if (collisions!=null){
      collisions.forEach((period) => {

        // number of events in that period
        if (period.length==0){
            return;
        }
        let count = period.reduce((a,b) => {
          return b ? a + 1 : a;
        })

        if (count > 1) {
          period.forEach((event, id) => {
            // max number of events it is sharing a time period with determines width
            if (period[id]) {
              if (count > width[id]) {
                width[id] = count;
              }
            }

            if (period[id] && !leftOffSet[id]) {
              leftOffSet[id] = period[id];
            }
          })
        }
      });
    }
};

var layOutDay = (events) => {

// clear any existing nodes
var myNode = document.getElementById("events");
myNode.innerHTML = '';

  getCollisions(events);
  getAttributes(events);
  var heighttotal = 0;

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    // let top = (event.start-1) / minutesinDay * containerHeight  + 977;


    let top = (event.start) / minutesinDay * containerHeight - heighttotal;
    // console.log(top);
    heighttotal += height
    // console.log(toptotal);
    let end = event.end;
    let start = event.start;
    let units = width[id];
    if (!units) {units = 1};
    let left = (containerWidth / width[id]) * (leftOffSet[id] - 1);
    // if (!left || left < 0) {left = 10};
    createEvent(height, top, left, units, event.title, event.loc);
  });
}