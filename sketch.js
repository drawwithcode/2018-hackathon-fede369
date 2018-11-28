var song;
var analyzer;
var volhistory = [];
var volume;
var hhh;
var x = 0;
var osc;
var fft;
var myImage;

function preload() {
  song = loadSound("./assets/GameOfThrones.mp3");
  myImage = loadImage("./assets/logoo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.loop();
  angleMode(DEGREES);
  song.play();
  song.setVolume(0.5);

  analyzer = new p5.Amplitude();
  analyzer.setInput(song);

  osc = new p5.Oscillator();
  osc.amp(0);
  osc.start();
  fft = new p5.FFT();
}

function draw() {
  background("#304659");
  //first shape: round vertex
  push();
  var vol = analyzer.getLevel();
  volhistory.push(vol);
  stroke(lerpColor(color("#EFD1BB"), color("#964549"), frameCount / 100));
  strokeWeight(2);
  fill(lerpColor(color("#964549"), color("#EFD1BB"), frameCount / 500));
  translate(width / 2, height / 2);
  beginShape();
  for (var i = 0; i < 360; i++) {
    var r = map(volhistory[i], 0, 1, 100, 700);
    var x = r * cos(i);
    var y = r * sin(i);
    vertex(x, y);
  }
  endShape();
  if (volhistory.length > 360) {
    volhistory.splice(0, 1);
  }
  pop();

  //second shape:  ellipse
  push();
  var rms = analyzer.getLevel();
  fill(lerpColor(color("#EFEDDC"), color("#304659"), frameCount / 60));
  stroke(lerpColor(color("#AF893D"), color("#AF893C"), frameCount / 60));
  strokeWeight(2);
  ellipse(width / 2, height / 2, 10 + rms * 500, 10 + rms * 500);
  pop();

  //third shape: spectrum
  push();
  var spectrum = fft.analyze();
  noStroke();
  fill(lerpColor(color("#EFEDDC"), color("#AF893D"), frameCount / 120));
  for (var i = 0; i < spectrum.length; i++) {
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h / 2);
  }
  pop();

  //fourth shape: linear vertex vertical
  push();
  volume = analyzer.getLevel();
  volhistory.push(volume);
  hhh = width / 2;
  noFill();
  stroke(lerpColor(color("#EFEDDC"), color("#AF893D"), frameCount / 100));
  strokeWeight(2);
  beginShape();
  for (var i = 0; i < volhistory.length; i += 5) {
    x = map(volhistory[i] / 2, 0, 1, hhh, 0);
    var y = i;
    line(width / 2, height / 2, x, y);
  }
  if (volhistory.length > width) {
    volhistory = [];
    hhh += 150;
  }
  endShape();
  pop();

  //fifth shape: linear vertex horizontal
  push();
  volume = analyzer.getLevel();
  volhistory.push(volume);
  hhh = height / 2;
  noFill();
  stroke(lerpColor(color("#EFEDDC"), color("#AF893D"), frameCount / 100));
  strokeWeight(2);
  beginShape();
  for (var i = 0; i < volhistory.length; i += 5) {
    x = i;
    var y = map(volhistory[i] / 2, 0, 1, hhh, 0);
    line(width / 2, height / 2, x, y);
  }
  if (volhistory.length > width) {
    volhistory = [];
    hhh += 150;
  }
  endShape();
  pop();

  //text
  textFont("Cinzel Decorative");
  textAlign(CENTER);
  textSize(50);
  fill("#AF893C");
  text("Game Of Thrones", width / 2, height - 100);
  //image
  image(
    myImage,
    width / 2 - 40,
    height - 90,
    myImage.width / 17,
    myImage.height / 17
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
