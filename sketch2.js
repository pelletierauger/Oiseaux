var previousPoints;

function preload() {
    previousPoints = loadJSON("points.json");
}

function setup() {
    createCanvas(100, 100);
    background(255, 0, 0);
    console.log("Yh");

    console.log("Yeah", previousPoints.length);
    // console.log("Yeah", previousPoints.length);
}
