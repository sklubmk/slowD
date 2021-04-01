//import java.awt.event.MouseWheelEvent;

var dragX;
var dragY;
var presentX;
var presentY;
var dragging;
var bg;
var btn1;
var btnE;
var btn2;
var btn3;
var font;
var d= 40;
var xo;
var yo;
var angle = 0;
var xs = 0;
var ys = 0;
var defaultWidth;
var zoom;
var degree = 0;
var x6;
var y6;
const UP = 1;
const DOWN = 2;
var s=0;
var m=28;
var h=5;
var a;
var rectX, rectY;      // Position of square button
var circleX, circleY;  // Position of circle button
var n=0;
var rectOver = false;
var circleOver = false;
var on = false;
var rectSize  = 30;
var circleSize= 20;
var isClickedCalendarMonth = false;
var isClickedCalendarDay = false;
var drawData = 0;
var clickDate;
var stations = [];
var csv;
var transX;
var transY;
var eventClick;
var eventSelect;
var eventImages = Array(16).fill(null);

const eventDateList = {
  0:{m:1,d:1},
  1:{m:2,d:10},
  2:{m:2,d:14},
  3:{m:3,d:1},
  4:{m:3,d:14},
  5:{m:5,d:5},
  6:{m:5,d:17},
  7:{m:5,d:20},
  8:{m:6,d:6},
  9:{m:8,d:15},
  10:{m:9,d:19},
  11:{m:10,d:3},
  12:{m:10,d:9},
  13:{m:12,d:24},
  14:{m:12,d:25},
  15:{m:12,d:31}
};
//  String readAll = FTFile.Read("https://JinkiKim.github.io/stations/"+ "가락시장"+".csv","csv");
//  FTReadCSV Acsv = new FTReadCSV();
//  Acsv.StringToCsv(readAll);
//  
//  Table table = loadTable("https://JinkiKim.github.io/stations/"+ "가락시장"+".csv");

class Station {

  constructor( px, py, name, l, val, val2) {
    this.posX = px;
    this.posY = py;
    this.line = l;
    this.v1 = val;
    this.v2 = val2;

    if (drawData ===0) {
      this.value = Math.floor(val/250);
    } else {
      if ( val2 != 0) {
        this.value = Math.floor(val*10/val2);
      } else {
        this.val2 = 0;
      }
    }
    this.sName = name;
  }
}

function defaultFunc(csv_) {

  //-------------------------- initialize --------------------------//

  var b;
  var a0, a1;
  var a2;
  var a3, a5;
  var a6 = null;
  csv = csv_;
  for (let i = 0; i < csv_.rows.length; i++) {  

    a0 = Math.floor(csv.getNum(i, 0));
    a1 = Math.floor(csv.getNum(i, 1));
    a2 = csv_.getString(i, 2);
    a3 = Math.floor(csv.getNum(i, 3));
    a5 = Math.floor(csv.getNum(i, 5));

    while ( a6===null) {
      a6= csv_.getString(i, 6);
    }

    if (a6.length===3) {
      a6 = "0" + a6;
    } else if (a6.length===2) {
      a6 = "00" + a6;
    }

    b = Math.floor(a6);

    stations.push(new Station( a0, a1, a2, a3, a5, b ) );
  }


  //------------ sort -------------//

  stations.sort((a, b)=>{
    if(a.sName<b.sName){
      return -1;
    }
    else if(a.sName === b.sName){
      return 0; 
    }
    else{
      return 1;
    }
  });


  // -- date select test -- //

  dateSelect(3, 1, 14);

  //------------ MouseListener --------------//
  // addMouseWheelListener(new java.awt.event.MouseWheelListener(){
  // public void mouseWheelMoved(java.awt.event.MouseWheelEvent evt){
  //   mouseWheel(evt);
  // }});
  //
}

function preload() {
  var urlsT = "stationT.csv";
  var url = "svg/bgimg.svg";
  bg = loadImage(url, "svg");
  loadTable(urlsT, "csv", "header", defaultFunc);
}

function setup() {
  defaultWidth = window.innerWidth > 1600 ? 1600 : window.innerWidth;
  zoom = defaultWidth/1600;
  createCanvas( defaultWidth, defaultWidth * (11/16) );
  frameRate(10);

  //-------- background Image --------//
  var urlbtn1 = "svg/event.svg";
  var urlbtnE = "svg/eventE.svg";
  var urlbtn2 = "svg/monthday.svg";
  var urlbtn3 = "svg/time.svg";

  btn1 = loadImage(urlbtn1, "svg");
  btnE = loadImage(urlbtnE, "svg");
  btn2 = loadImage(urlbtn2, "svg");
  btn3 = loadImage(urlbtn3, "svg");
  for(let i = 0; i < 16; i++){
    eventImages[i] = loadImage("svg/event"+i+".svg","svg");
  }
  xs = 0;
  ys = 0;
  xo = defaultWidth;
  yo = defaultWidth * (11/16);
  transX = 0;
  transY = 0;
  dragging = false;
  dragX=0;
  dragY=0;  
  presentX = 0;
  presentY = 0;
  eventClick = false;
  eventSelect = 3;
  //----------------- font ------------------//
  font = textFont("NanumGothicBold");
  textFont(font);

  //-------------- Clock ---------------//
  smooth();
  a=0.2;
  circleX = 30;
  circleY = 15;
  rectX = 10;
  rectY = 10;
}

function draw() {
  //rotate (angle);

  //------------ background -------------//

  background("#2b2333");
  //image(bg, transX + xs, transY + ys, xo, yo);
  image(bg, 0, 0, xo, yo);
  
  
  //--------------- Zoom ----------------//
  scale(zoom);

  //-------------- Station --------------//

  for (let ii = 0; ii< stations.length; ii++) {
    drawStroke(stations[ii].posX, stations[ii].posY, stations[ii].value+2, stations[ii].line, 150, 5);
    drawGradient(stations[ii].posX, stations[ii].posY, stations[ii].value, 0);
  }

  for (let ii = 0; ii< stations.length; ii++) {

    //--------- mouse hover ----------//
    if (overCircle(stations[ii].posX-1, stations[ii].posY, stations[ii].value*2*zoom+3) & !on) {

      on = true;
      drawStroke(stations[ii].posX, stations[ii].posY, stations[ii].value+3, stations[ii].line, 255, 5);
      drawGradient(stations[ii].posX, stations[ii].posY, stations[ii].value, 1);

      rectMode(CENTER);
      stroke(190);
      fill(200);
      rect(transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-25, 100, 50, 12, 12, 12, 12 );          


      push();
      translate(transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-25);
      stroke(0);
      pop();

      fill("#000000");
      textAlign(CENTER,CENTER);
      textSize(3);

      if (drawData===0) {
        text(stations[ii].sName, transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-35);
        text(stations[ii].v1+""+stations[ii].v2+"명", transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-15);
      } else {
        text(stations[ii].sName, transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-35);
        text(stations[ii].v1+"명", transX + stations[ii].posX, transY + stations[ii].posY -stations[ii].value-15);
      }
    }
  }

  //----------- event Click -----------//

  if (eventClick) {
    image(btnE, transX + 246.5, transY + 82, 180, 557);
  }

  if (eventSelect === -1) {
    image(btn1, transX + 247.896, transY + 48.152, 179, 34);
  } else {
    //var btnSelect = loadImage("svg/event" + eventSelect + ".svg", "svg");
    image(eventImages[eventSelect], transX + 247.896, transY + 48.152, 179, 34);
    
  }
  image(btn2, transX + 471.118, transY + 48.152, 179, 34);
  image(btn3, transX + 664.479, transY + 48.152, 179, 34);

  update(mouseX, mouseY);
}

function dateSelect( clickMonth, clickDay, clickTime) {


  var ncsv;
  var clickDate;

  if ( 0 < clickMonth & clickMonth <10 ) {

    if ( 0< clickDay & clickDay < 10) {
      clickDate = "2013-0" + clickMonth + "-0" + clickDay;
    } else {
      clickDate = "2013-0" + clickMonth + "-" + clickDay;
    }
  } else {

    if ( 0< clickDay & clickDay < 10) {
      clickDate = "2013-" + clickMonth + "-0" + clickDay;
    } else {
      clickDate = "2013-" + clickMonth + "-" + clickDay;
    }
  }

  drawData=1;
  var meanVal = 0;

  clickDate = "date/" + clickDate + ".csv";

  ncsv = loadTable(clickDate, "csv","header",  
    function(){
      stations = [];
    
      for ( let i=0; i<ncsv.rows.length; i++) {
        meanVal += Math.floor(ncsv.getNum(i, clickTime+1))/ncsv.getRowCount();
      }
    
      for ( let i =0; i<ncsv.rows.length; i++) {
    
        var valK = Math.floor(ncsv.getNum(i, clickTime+1));
    
        stations.push(
          new Station(
          Math.floor(ncsv.getNum(i, 26)), 
          Math.floor(ncsv.getNum(i, 27)), 
          ncsv.getString(i, 0), 
          Math.floor(ncsv.getNum(i, 28)), 
          valK, 
          Math.floor(meanVal)));
      }  
    });
}
function drawStroke( x, y, radius, li, alpha, weight) {

  ellipseMode(RADIUS);
  if (li<10) {
    strokeCheck(li, alpha, weight);
    ellipse(transX+x, transY+y, radius, radius);
  } else {
    drawArc(x, y, radius, li, alpha);
  }
}
function strokeCheck( li, alpha, weight) {

  switch(li) {
  case 1:
    stroke(17, 24, 139, alpha);
    strokeWeight(weight);
    fill(17, 24, 139, 0);
    break;
  case 2:
    stroke(28, 76, 35, alpha);
    strokeWeight(weight);
    fill(28, 76, 35, 0);
    break;
  case 3:
    stroke(240, 93, 8, alpha);
    strokeWeight(weight);
    fill(240, 93, 8, 0);
    break;
  case 4:
    stroke(14, 120, 200, alpha);
    strokeWeight(weight);
    fill(14, 120, 200, 0);
    break;
  case 5:
    stroke(83, 38, 118, alpha);
    strokeWeight(weight);
    fill(83, 38, 118, 0);
    break;
  case 6:
    stroke(99, 39, 19, alpha);
    strokeWeight(weight);
    fill(99, 39, 19, 0);
    break;
  case 7:
    stroke(62, 69, 39, alpha);
    strokeWeight(weight);
    fill(62, 69, 39, 0);
    break;
  case 8:
    stroke(204, 25, 128, alpha);
    strokeWeight(weight);
    fill(204, 25, 128, 0);
    break;
  case 9:
    stroke(200, 200, 200, alpha);
    strokeWeight(weight);
    fill(240, 93, 8, 0);
    break;
  case -1:
    stroke(225, 79, 95, alpha);
    strokeWeight(weight);
    fill(0, 0, 0, 0);
    break;  
  case -2:
    stroke(136, 108, 86, alpha);
    strokeWeight(weight);
    fill(0, 0, 0, 0);
    break;
  case -3:
    stroke(211, 188, 128, alpha);
    strokeWeight(weight);
    fill(0, 0, 0, 0);
    break;
  case -4:
    stroke(255, 255, 194, alpha);
    strokeWeight(weight);
    fill(0, 0, 0, 0);
    break;
  case -5:
    stroke(255, 255, 230, alpha);
    strokeWeight(weight);
    fill(0, 0, 0, 0);
    break;
  }
}
function drawArc( x, y, radius, line, alpha) {

  var firstLine, secondLine;

  if (line>100) {
    firstLine= Math.floor(line/100);
    secondLine= Math.floor( line/10) - firstLine*10;
    var thirdLine = Math.floor(line % 10);
    noFill();
    strokeCheck(firstLine, alpha, 5);
    arc(transX+x, transY+y, radius, radius, 0, TWO_PI/3);
    strokeCheck(secondLine, alpha, 5);
    arc(transX+x, transY+y, radius, radius, TWO_PI/3, TWO_PI*2/3);
    strokeCheck(thirdLine, alpha, 5);
    arc(transX+x, transY+y, radius, radius, TWO_PI*2/3, TWO_PI);
  } else {
    firstLine = Math.floor(line/10);
    secondLine = Math.floor(line%10);
    noFill();
    strokeCheck(firstLine, alpha, 5);
    arc(transX+x, transY+y, radius, radius, QUARTER_PI, PI+QUARTER_PI);
    strokeCheck(secondLine, alpha, 5);
    arc(transX+x, transY+y, radius, radius, PI+QUARTER_PI, TWO_PI+QUARTER_PI);
  }
}
function drawGradient( x, y, radius, mode) {

  /*
  colorMode(HSB,360,100,100);
   stroke(240,93,8);
   */

  var col = 110;
  for (let r = Math.floor(radius); r > 0; r-=1) {

    if (col <0) {
      col = 0;
    } else {
      col -= 110/radius;
    }

    if (mode===0) {
      if (0 < radius & radius <= 10) {
        drawStroke(x, y, r, -2, Math.floor(col), 3);
      } else if (10< radius & radius <= 25) {
        drawStroke(x, y, r, -3, Math.floor(col), 3);
      } else if (25 < radius & radius <= 40) {
        drawStroke(x, y, r, -4, Math.floor(col), 3);
      } else if (radius >40) {
        drawStroke(x, y, r, -5, Math.floor(col), 3);
      }
    } else if (mode===1) {
      drawStroke(x, y, r, -1, Math.floor(col), 3);
    }
  }
}
//void mouseWheel(MouseWheelEvent event) {
//  
//  //--------------- Zoom ---------------//
//      zoom += event.getWheelRotation()*.02;
// 
//      if(zoom <0.7)
//        zoom = 0.7;
//        
//  // xs = (1- zoom) * mouseX;
//  // ys = (1- zoom) * mouseY;
// 
//}

function update( x, y) {

  if ( overCircle(circleX, circleY, circleSize) ) {
    circleOver = true;
    rectOver = false;
  } else if ( overRect(rectX, rectY, rectSize, rectSize) ) {
    rectOver = true;
    circleOver = false;
  } else {
    on = false;
    circleOver = rectOver = false;
  }
}
function mousePressed() {

  if (circleOver) {
    a -= 0.1;
  }
  if (rectOver) {
    a += 0.1;
  }
}
function mouseDragged() {

  //if (!dragging) {
  //  dragging = true;
  //  dragX = mouseX;
  //  dragY = mouseY;
  //}

  //transX = presentX + (mouseX - dragX);
  //transY = presentY + (mouseY - dragY);

  //if (transX > 0) {
  //  transX = 0;
  //  dragX = mouseX;
  //}
  //if (transY > 0) {
  //  transY = 0;
  //  dragY = mouseY;
  //}
}
function mouseClicked() {
  dragging = true;

  if (overRect(transX+247.896, transY+48.152, 179, 34) & !eventClick) {
    eventClick = true;
  } else if (!overRect(transX+247.896, transY+82, 180, 557) & eventClick) {
    eventClick = false;
    eventSelect = -1;
  }

  for ( let i = 0; i<16; i++) {
    if (overRect(transX+247.896, transY+82+34*i, 179, 34) & eventClick) {
      eventSelect = i;
      eventClick = false;
      dateSelect(eventDateList[i].m,eventDateList[i].d,14);
    }
  }
  //   else if(overRect(transX+247.896,transY+48.152,179,34) & eventClick){


  //   if(overRect(
  //   {
  //     
  //   }
}
function mouseReleased() {
  presentX = transX;
  presentY = transY;
  dragging = false;
}
function overRect( x, y, width, height) {
  x = (transX + x)*zoom;
  y = (transY + y)*zoom;
  if (mouseX >= x && mouseX <= x+width && 
    mouseY >= y && mouseY <= y+height) {
    return true;
  } else {
    return false;
  }
}

function overCircle( x, y, diameter) {
  x = (transX + x)*zoom;
  y = (transY + y)*zoom;
  var disX = x - mouseX;
  var disY = y - mouseY;
  if (sqrt(sq(disX) + sq(disY)) < diameter/2 ) {
    return true;
  } else {
    return false;
  }
}
