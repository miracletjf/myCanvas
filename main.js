var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var config = {
  width: 5,
  color: '#333',
  mode: 'paint',
  drawing: false
};

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

var loc = {};

if(canvas.ontouchstart !== undefined){
  canvas.ontouchstart = function (event) {
    config.drawing = true;
    loc.x = event.targetTouches[0].clientX;
    loc.y = event.targetTouches[0].clientY;
    context.strokeStyle = config.color;
    context.lineWidth = config.width;
  };
  canvas.ontouchmove = function (event) {
    var locNow = {};
    if(config.drawing){
      locNow.x = event.targetTouches[0].clientX;
      locNow.y = event.targetTouches[0].clientY;
      if (config.mode === 'paint') {
        draw(loc,locNow);
        loc = locNow;
      } else {
        context.clearRect(locNow.x-config.width*1.5,locNow.y-config.width*1.5,config.width * 3,config.width * 3);
      }
    }
  };
  canvas.ontouchend = function (event) {
    config.drawing = false;
  }
}else{
  canvas.onmousedown = function (event) {
    config.drawing = true;
    loc.x = event.clientX;
    loc.y = event.clientY;
    context.strokeStyle = config.color;
    context.lineWidth = config.width;
  };
  canvas.onmousemove = function (event) {
    var locNow = {};
    if(config.drawing){
      locNow.x = event.clientX;
      locNow.y = event.clientY;
      if (config.mode === 'paint') {
        draw(loc,locNow);
        loc = locNow;
      } else {
        context.clearRect(locNow.x-config.width*1.5,locNow.y-config.width*1.5,config.width * 3,config.width * 3);
      }
    }
  };
  canvas.onmouseup = function () {
    config.drawing = false;
  };
}

function draw(startPosition,endPosition) {
  context.beginPath();
  context.moveTo(startPosition.x,startPosition.y);
  context.lineTo(endPosition.x,endPosition.y);
  //使线变得圆滑，连续
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
  context.closePath();
}


function clearContent() {
  context.clearRect(0,0,canvas.width,canvas.height);
}

function changePaint() {
  config.mode = 'paint';
}

function changeRubber() {
  config.mode = 'rubber';
}

function downloadImg(){
  if(!checkPlatform()){
   downLoadImgPC() 
  }else {
   downLoadImgPhone(); 
  }
}

// 下载图片（手机）
function downLoadImgPhone() {
  document.querySelector('#img').src = canvas.toDataURL("image/png");
  document.querySelector('.pop-box').style.display = "block";
}

document.documentElement.addEventListener('touchstart',function(e){
  if(e.target === document.querySelector('.pop-box') ||
     e.target === document.querySelector('.preview') ||
     e.target === document.querySelector('.pop-box h2')){
    document.querySelector('.pop-box').style.display = "none";
  }
});

// 下载图片（pc）
function downLoadImgPC() {
  var link = document.createElement('a');
  var evt = document.createEvent("MouseEvents");
  link.setAttribute('download', 'myPaint.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
  link.remove();
}

// 通过检测设备是否支持 touchStart 事件 判断是否为 移动端

function checkPlatform() {
  var div = document.createElement('div');
  return 'ontouchstart' in div;
}

var colors = document.querySelectorAll('.color');
var colorsArr = Array.prototype.slice.call(colors,0);
var colorNumber = 0;
colorsArr.forEach(function (ele, number) {
  colors[number].onclick = function () {
    colors[colorNumber].className = 'color';
    this.className = 'color active';
    config.color = ele.style.background;
    colorNumber = number;
  }
});
var paint = document.getElementById('paint');
var rubber = document.getElementById('rubber');
paint.onclick = function () {
  rubber.className = 'btn';
  paint.className = 'btn active';
  config.mode = 'paint';
};
rubber.onclick = function () {
  paint.className = 'btn';
  rubber.className = 'btn active';
  config.mode = 'rubber';
};

var lines = document.querySelectorAll('.line');
var linesArr = Array.prototype.slice.call(lines,0);
var lineNumber = 1;
linesArr.forEach( function (ele,number) {
  lines[number].onclick = function () {
    lines[lineNumber].className = 'line';
    this.className = 'line active';
    config.width = parseInt(ele.style.height);
    lineNumber = number;
  }
});