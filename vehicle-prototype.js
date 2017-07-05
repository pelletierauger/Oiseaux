var vehicles = [];
var maxSpeed = 150;
var maxForce = 10;
var dSeparation = 20;
var seekForceMult = 0.4;

var Vehicle = function(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    //settings for scene01 with the window
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    // this.maxSpeed = 300;
    // this.maxForce = 20;
    vehicles.push(this);
};

Vehicle.prototype.applyForce = function(force) {
    this.acc.add(force);
};

Vehicle.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);

    var steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    // this.applyForce(steering);
    return (steering);
};

Vehicle.prototype.separate = function(vehicles) {
    var desiredSeparation = dSeparation;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < vehicles.length; i++) {
        var d = p5.Vector.dist(this.pos, vehicles[i].pos);
        if (d > 0 && d < desiredSeparation) {
            var diff = p5.Vector.sub(this.pos, vehicles[i].pos);
            diff.normalize();
            diff.div(d);
            sum.add(diff);
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        sum.normalize;
        sum.mult(this.maxSpeed);

        var steer = p5.Vector.sub(sum, this.vel);
        steer.limit(this.maxForce);
        // this.applyForce(steer);
        return (steer);
    }
    return (createVector(0, 0));
};

Vehicle.prototype.applyBehaviors = function(vehicles, target, applySeparate) {
    var separateForce = this.separate(vehicles);
    var seekForce = this.seek(target);

    separateForce.mult(applySeparate);

    // pour scene01 :
    // seekForce.mult(0.4);

    seekForce.mult(seekForceMult);

    this.applyForce(separateForce);
    this.applyForce(seekForce);
};

Vehicle.prototype.update = function(force) {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
};


// Vehicle.prototype.display = function(force) {
//     this.acc.add(force);
//     fill(0, 255);
//     // ellipse(this.pos.x, this.pos.y, 2.5);
//     push();
//     translate(this.pos.x, this.pos.y);
//     rotate(random() * TWO_PI);
//     var randomDot = Math.floor(random(0, dots.length - 1));
//     image(dots[randomDot], 0, 0, 12, 12);
//     pop();
//     // rect(this.pos.x, this.pos.y, 1, 1);
// };

Vehicle.prototype.display = function(i) {
    var s = map(this.pos.x, -width / 2, width / 2, 2, 30);
    // var s = 10;
    fill(0, 255);
    // ellipse(this.pos.x, this.pos.y, 2.5);
    push();
    translate(this.pos.x * 1 * zoom, this.pos.y * 1 * zoom);
    var maps = map(i, 0, points.length, 2, 5);
    rotate(sin(frameCount / maps) * TWO_PI);
    var randomDot = Math.floor(random(0, dots.length - 1));
    image(dots[Math.floor(abs(sin(i)) * 3)], 0, 0, s * zoom, s * zoom);
    pop();
    // rect(this.os.x, this.pos.y, 1, 1);
};
