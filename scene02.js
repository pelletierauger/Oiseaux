var looping = true;
var bufferRedraw = true;
var norma = false;
var accMult = 0;
var velMult = 1;
var amounts = 1;
var s = 15;

var previousPoints;
var previousPoints2;

var exporting = false;
var fileName = "oiseaux";

var points = [];
var pointsXY = [];
var draggy = 0;
var currentPoint = 0;

var dots = [];
var dotId = 0;

var w;
var w2;

var suburb;
var suburb2;
var seq5;
var seq5Overlay;

var zoom = 0.5;

var showGuides = true;

function preload() {
    for (var i = 0; i < 4; i++) {
        var img = loadImage("dot001-" + i + ".png");
        dots.push(img);
    }
    previousPoints = loadJSON("points4.json");
    // previousPoints2 = loadJSON("points5.json");
    suburb = loadImage("banlieue.png");
    suburb2 = loadImage("banlieue-overlay.png");
    seq5 = loadImage("seq5.png");
    seq5Overlay = loadImage("seq5-overlay.png");
    previousPoints = loadJSON("seq5.json");
}


function setup() {
    createCanvas(windowWidth, windowWidth * 9 / 16);
    background(0);
    fill(255, 150);
    noStroke();
    frameRate(24);

    rectMode(CENTER);
    imageMode(CENTER);

    // points.push(createVector(0, 0));

    // for (var j = 0; j < TWO_PI; j += increment) {
    //     var x = 150 + cos(j) * 150;
    //     var y = sin(j) * 150;
    //     var vehicles2 = new Vehicle2(x, y);
    //     // var vehicles = new Vehicle(x + width / 2, y + height / 2);
    // }
}

function draw() {
    translate(width / 2, height / 2);
    var t = frameCount;

    blendMode(NORMAL);
    background(255);
    blendMode(MULTIPLY);

    image(seq5, 0, 0, width * zoom, (width * 9 / 16) * zoom);

    // image(suburb, width / 2, height / 2, width, width * 9 / 16);
    // var x = cos(t / 10) * 300;
    // var y = sin(t / 10) * 300;

    // x = map(noise(t / 50), 0, 1, -width / 2, width / 2);
    // y = map(noise(1000 + t / 100), 0, 1, -height / 2, height / 2);

    // target = createVector(x + width / 2, y + height / 2);


    var applySeparate = map(sin(frameCount / 10), -1, 1, 0, 1) * 2;
    // applySeparate = map(sin(frameCount / 20), -1, 1, 0, 1) * 2;
    // applySeparate = map(sin(frameCount / 2), -1, 1, -1, 1) * 0.5;
    applySeparate = 1;
    if (points.length > 0) {

        w.update(createVector(points[currentPoint].x, points[currentPoint].y));


        if (showGuides) {

            for (var i = 0; i < points.length; i++) {
                push();
                fill(0, 50);
                translate(points[i].x * zoom, points[i].y * zoom);
                ellipse(0, 0, 5);
                pop();
            }

            fill(255, 0, 0);
            ellipse(points[currentPoint].x * zoom, points[currentPoint].y * zoom, 5);

            w.display();

        }

        // fill(255, 0, 0);
        // ellipse(target.x, target.y, 5);
        currentPoint++;
        if (currentPoint >= points.length) {
            currentPoint = 0;
            for (var k = 0; k < vehicles.length; k++) {
                vehicles[k].pos = createVector(points[0].x, points[0].y);
            }
        }

        // var shiftedPos = createVector((w.pos.x - 300) * 1.2, (w.pos.y - 200) * 2);


        // var shiftedPos = createVector(w.pos.x, w.pos.y);
        // var shiftedPos2 = createVector(w2.pos.x, w2.pos.y);
        for (var i = 0; i < vehicles.length; i++) {
            // vehicles[i].applyBehaviors(vehicles, target, applySeparate);

            // vehicles[i].applyBehaviors(vehicles, points[currentPoint], applySeparate);
            vehicles[i].applyBehaviors(vehicles, w.pos, applySeparate);
            vehicles[i].update();
            vehicles[i].display(i);
        }



        // for (var j = 0; j < vehicles2.length; j++) {
        //     // vehicles[i].applyBehaviors(vehicles, target, applySeparate);

        //     // vehicles[i].applyBehaviors(vehicles, points[currentPoint], applySeparate);
        //     vehicles2[j].applyBehaviors(vehicles2, shiftedPos2, applySeparate);
        //     vehicles2[j].update();
        //     vehicles2[j].display(j);
        // }
    }
    // blendMode(NORMAL);
    // image(suburb2, width / 2, height / 2, width, width * 9 / 16);
    if (exporting && frameCount % 2 == 0) {
        frameExport();
    }

    if (showGuides) {
        fill(255, 255, 0, 150);
        ellipse(0, 0, 15);
    }

    // if (!showGuides) {
    blendMode(NORMAL);
    image(seq5Overlay, 0, 0, width * zoom, (width * 9 / 16) * zoom);

    stroke(0);
    noFill();
    rect(0, 0, width * zoom, (width * 9 / 16) * zoom);
    noStroke();
    // }
}

function createVehicles(x, y) {
    var vehicleCount = 200;
    var increment = TWO_PI / vehicleCount;
    for (var i = 0; i < TWO_PI; i += increment) {
        // var x = noise(i) * 300;
        // var y = noise(i * 2) * 300;
        // x += cos(i) * 15;
        // y += sin(i) * 15;
        var vehicles = new Vehicle(x, y);
        // var vehicles = new Vehicle(x + width / 2, y + height / 2);
    }
}


function mousePressed() {
    points.push(createVector((mouseX - width / 2) / zoom, (mouseY - height / 2) / zoom));
}

function mouseDragged() {
    if (draggy > 1) {
        points.push(createVector((mouseX - width / 2) / zoom, (mouseY - height / 2) / zoom));
        draggy = 0;
    }
    draggy++;
}

function keyPressed() {
    if (keyCode === 32) {
        if (looping) {
            noLoop();
            looping = false;
        } else {
            loop();
            looping = true;
        }
    }
    if (key == 'g' ||  key == 'G') {
        showGuides = (showGuides) ? false : true;
    }
    if (key == 'k' ||  key == 'K') {
        zoom = 0.5;
    }
    if (key == 'l' ||  key == 'L') {
        zoom = 1;
    }
    if (key == 'r' || key == 'R' || key == 'm' || key == 'M') {
        background(51);
    }
    if (key == 'q' || key == 'Q') {
        if (bufferRedraw) { bufferRedraw = false; } else { bufferRedraw = true; }
    }
    if (key == 'p' || key == 'P') {
        pointsXY = [];
        for (var i = 0; i < points.length; i++) {
            pointsXY.push([points[i].x, points[i].y]);
        }
    }
    if (key == 'a' || key == 'A') {
        points = [];
        for (var k = 0; k < previousPoints.length; k++) {
            // console.log("yeah!");
            points.push(createVector(previousPoints[k][0], previousPoints[k][1]));
        }
        // points2 = [];
        // for (var l = 0; l < previousPoints2.length; l++) {
        //     // console.log("yeah!");
        //     points2.push(createVector(previousPoints2[l][0], previousPoints2[l][1]));
        // }
        w = new Walker(points[0].x, points[0].y);
        // w2 = new Walker(points2[0].x, points2[0].y);
        // exporting = true;

        createVehicles(points[0].x, points[0].y);
    }
    if (key == 'b' || key == "B") {
        w = new Walker(0, 0);
        // w2 = new Walker(0, 0);
        var v = createVector((mouseX - width / 2) / zoom, (mouseY - height / 2) / zoom);
        createVehicles(v.x, v.y);
    }
}

function Walker(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    this.reset = function() {
        this.pos = createVector(0, 0);
        this.vel = createVector(0, 0);
    }

    this.update = function(vec) {
        this.acc = p5.Vector.sub(vec, this.pos);
        // if (norma) {
        //     this.acc.normalize();
        // }
        this.acc.mult(0.005);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.mult(0.9);
    }

    this.display = function() {
        fill(0, 255, 0);
        ellipse(this.pos.x * zoom, this.pos.y * zoom, s, s);
    }
}

function frameExport() {
    var formattedFrameCount = "" + frameCount;
    while (formattedFrameCount.length < 5) {
        formattedFrameCount = "0" + formattedFrameCount;
    }
    save(fileName + "_" + formattedFrameCount + ".png");
}
