var w, h;

var canvas = document.querySelector('#canvas');
var drawContext = canvas.getContext('2d');
var audioContext = new window.AudioContext();
var analyser = audioContext.createAnalyser();
var source = audioContext.createBufferSource();
var frame = new Uint8Array(analyser.frequencyBinCount / 2);

var resize = function() {
  setTimeout(function() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }, 10);
};

function loadSound(url, cb) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    audioContext.decodeAudioData(request.response, cb);
  };

  request.send();
};

var add = function(a, b) {
  return a + b;
}

var draw = function() {
  analyser.getByteFrequencyData(frame);
  drawContext.fillStyle = 'rgba(0, 0, 0, .3)';
  drawContext.fillRect(0, 0, w, h);
  var scale = 4;
  var gap = 1;

  for (var f = 0; f < frame.length / scale; f++) {
    var values = frame.slice(f * scale, (f + 1) * scale);
    var value = values.reduce(add) / scale;

    var percent = value / 256;
    var height = h * percent;
    var offset = h - height - 1;
    var barWidth = w / frame.length * scale;

    drawContext.fillStyle = 'rgba(0, 255, 255, ' + percent + ')';
    drawContext.fillRect(f * (barWidth + gap), offset, barWidth, height);
  }

  window.requestAnimationFrame(draw);
};

var playSound = function(buffer) {
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  source.connect(analyser);
  draw();
}



window.onresize = resize;
resize();
loadSound('test.mp3', playSound);
