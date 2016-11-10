var w, h;

var canvas = document.querySelector('#canvas');
var drawContext = canvas.getContext('2d');
var audioContext = new window.AudioContext();
var analyser = audioContext.createAnalyser();
//analyser.smoothingTimeConstant = 1;
var source = audioContext.createBufferSource();
//source.playbackRate.value = .5;
source.loop = true;
var frame = new Uint8Array(analyser.frequencyBinCount / 2);

var resize = function() {
  setTimeout(function() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }, 10);
};

function loadSound(url, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    audioContext.decodeAudioData(request.response, callback);
  };

  request.send();
};

var add = function(a, b) {
  return a + b;
}

var frames = [];
var frameIndex = 0;

var draw = function() {
  frameIndex += 1;
  analyser.getByteFrequencyData(frame);
  drawContext.fillStyle = 'rgba(0, 0, 0, ' + renderParams.fade + ')';
  drawContext.fillRect(0, 0, w, h);
  var scale = renderParams.scale;

  var med = frame.reduce(add) / scale;
  console.log(med);

  for (var f = 0; f < frame.length / scale; f++) {
    var values = frame.slice(f * scale, (f + 1) * scale);
    var value = values.reduce(add) / scale;

    var percent = value / 256;
    var height = h * percent;
    var offset = h - height - 1;
    var barWidth = w / frame.length * scale;

    drawContext.fillStyle = 'rgb(0, 255, 255)';
    drawContext.fillRect(f * (barWidth + renderParams.gap), offset, barWidth, height);
  }

  window.requestAnimationFrame(draw);
};

var playSound = function(buffer) {
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0,13);
  source.connect(analyser);
  draw();
}

var renderParams = { scale: 2, gap: 2, fade: .3 };
window.onresize = resize;

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(analyser, 'smoothingTimeConstant', 0, 1);
  gui.add(source.playbackRate, 'value', 0, 2);
  gui.add(renderParams, 'scale', 1, 32);
  gui.add(renderParams, 'gap', 2, 16);
  gui.add(renderParams, 'fade', 0, 1);

  resize();
  loadSound('rain.mp3', playSound);
}
