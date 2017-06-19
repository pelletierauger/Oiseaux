var looping = true;
var bufferRedraw = true;
var norma = false;
var accMult = 0;
var velMult = 1;
var amounts = 1;
var s = 15;

var previousPoints;

var exporting = false;
var fileName = "oiseaux";

var points = [];
var pointsXY = [];
var draggy = 0;
var currentPoint = 0;

var dots = [];
var dotId = 0;

var w;

function preload() {
    for (var i = 0; i < 4; i++) {
        var img = loadImage("dot001-" + i + ".png");
        dots.push(img);
    }
    previousPoints = loadJSON("points.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    fill(255, 150);
    noStroke();
    frameRate(24);

    imageMode(CENTER);

    // points.push(createVector(0, 0));

    var vehicleCount = 400;
    var increment = TWO_PI / vehicleCount;
    for (var i = 0; i < TWO_PI; i += increment) {
        // var x = noise(i) * 300;
        // var y = noise(i * 2) * 300;
        var x = cos(i) * 150;
        var y = sin(i) * 150;
        // var vehicles = new Vehicle(x, y);
        var vehicles = new Vehicle(x + width / 2, y + height / 2);
    }
}

function draw() {
    var t = frameCount;

    blendMode(NORMAL);
    background(255);
    blendMode(MULTIPLY);

    var s = frameCount;
    var x = cos(t * 0.1) * s;
    var y = sin(t * 0.1) * cos(t * 0.1) * s;

    // x = map(noise(t / 50), 0, 1, -width / 2, width / 2);
    // y = map(noise(1000 + t / 100), 0, 1, -height / 2, height / 2);

    target = createVector(x + width / 2, y + height / 2);

    // for (var i = 0; i < points.length; i++) {
    //     push();

    //     fill(255, 50);
    //     translate(points[i].x, points[i].y);
    //     ellipse(0, 0, 5);
    //     pop();
    // }
    // var applySeparate = map(sin(frameCount / 10), -1, 1, 0, 1) * 2;
    var applySeparate = map(sin(frameCount / 20), -1, 1, 0, 1) * 2;
    applySeparate = map(sin(frameCount / 2), -1, 1, 0, 1);
    applySeparate = 1;
    if (points.length > 0) {
        // fill(255, 0, 0);
        // ellipse(points[currentPoint].x, points[currentPoint].y, 5);
        w.update(createVector(points[currentPoint].x, points[currentPoint].y));
        // w.display();
        fill(255, 0, 0);
        ellipse(target.x, target.y, 5);
        currentPoint++;
        if (currentPoint >= points.length) {
            currentPoint = 0;
            for (var k = 0; k < vehicles.length; k++) {
                vehicles[k].pos = createVector(points[0].x, points[0].y);
            }
        }
        for (var i = 0; i < vehicles.length; i++) {
            vehicles[i].applyBehaviors(vehicles, target, applySeparate);

            // vehicles[i].applyBehaviors(vehicles, points[currentPoint], applySeparate);
            // vehicles[i].applyBehaviors(vehicles, w.pos, applySeparate);
            // vehicles[i].seek(target);
            // vehicles[i].separate(vehicles);


            vehicles[i].update();
            vehicles[i].display(i);
        }
    }

    if (exporting) {
        frameExport();
    }

}


function mousePressed() {
    points.push(createVector(mouseX, mouseY));
}

function mouseDragged() {
    if (draggy > 1) {
        points.push(createVector(mouseX, mouseY));
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
            console.log("yeah!");
            points.push(createVector(previousPoints[k][0], previousPoints[k][1]));
        }
        w = new Walker(points[0].x, points[0].y);
        // exporting = true;
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
        this.acc.mult(0.0025);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.mult(0.9);
    }

    this.display = function() {
        fill(0, 255, 0);
        ellipse(this.pos.x, this.pos.y, s, s);
    }
}

function frameExport() {
    var formattedFrameCount = "" + frameCount;
    while (formattedFrameCount.length < 5) {
        formattedFrameCount = "0" + formattedFrameCount;
    }
    save(fileName + "_" + formattedFrameCount + ".png");
}
