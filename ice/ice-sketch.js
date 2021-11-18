
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;
const drawConstraint = Helpers.drawConstraint;

// ice environment
let iceCamera;
let ice_x = 0;
let ice_y = 0;

// ice bodies
let ice_starting_rectangle;
let second_ice_starting_rectangle;
let ice_starting_raised_rectangle;
let ice_starting_dominoes = [];
let ice_starting_flag;

// ice images
let ice_flag_image;

let engine;
let particles = [];
let pegs = [];
let mainBody;
let mouse;
let mouseConstraint;

function preload() {
    ice_flag_image = loadImage("flag.png");
}

function randomNumber(lowerBound, upperBound) {
    return Math.floor((Math.random() * upperBound) + lowerBound);
}

function createPegs(x, y, rows, columns, spacing, radius) {
    var pegs = [];
    var startX = x;
    var tempX = x;
    var tempY = y;
    for (var i = 0;i < rows;i++) {
        for (var j = 0;j < columns;j++) {
            pegs.push(new IceParticlePeg(tempX, tempY, radius));
            tempX += spacing + radius;
        }
        tempY += spacing + radius;
        if (i + 1 % 2 == 0) {
            tempX = startX;
        } else {
            tempX = startX + 0.5 * (spacing + radius);
        }
    }
    return pegs;
}

function createDominoes(x, y, width, height, dominoCount, spacing) {
    var dominoes = [];
    for (var i = 0;i < dominoCount;i++) {
        var rgb = "rgb(" + randomNumber(1, 255) + "," + randomNumber(1, 255) + "," + randomNumber(1, 255) + ")";
        dominoes.push(new IceDomino(x, y - height * 0.5, width, height, rgb));
        x += spacing + 0.5 * width;
    }
    return dominoes;
}

function moveCamera(newPositionX, newPositionY, newPositionZ) {
    iceCamera.move(newPositionX, newPositionY, newPositionZ);
}

function setup() {

    // create the canvas, engine, and the camera
    const canvas = createCanvas(screen.availWidth, screen.availHeight, WEBGL);
    engine = Engine.create();
    world = engine.world;
    iceCamera = createCamera();
    moveCamera(ice_x + 400, ice_y + 500, 0);

    // create all ice objects here
    ice_starting_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 420, 660, 60, { isStatic: true });
    second_ice_starting_rectangle = Bodies.rectangle(ice_x + 1060, ice_y + 420, 800, 60, { isStatic: true });
    ice_starting_raised_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 370, 660, 40, { isStatic: true });
    // pegs = createPegs(500, 600, 5, 14, 98, 10);
    ice_starting_dominoes = createDominoes(ice_x + 700, ice_y + 340, 20, 100, 14, 20);
    mainBody = Bodies.circle(100, 300, 40, { density: 0.1 });
    ice_starting_flag = new Flag(ice_flag_image, ice_x + 1460, ice_y + 400);

    // setup mouse
    // mouse = Mouse.create(canvas.elt);
    // const mouseParams = {
    //     mouse: mouse,
    //         constraint: { stiffness: 0.05 }
    // }
    // mouseConstraint = MouseConstraint.create(engine, mouseParams);
    // mouseConstraint.mouse.pixelRatio = pixelDensity();
    // World.add(world, mouseConstraint);

    // adding all ice objects into one ice bodies array
    var iceBodies = [ice_starting_rectangle, second_ice_starting_rectangle, mainBody, ice_starting_raised_rectangle];
    for (var i = 0;i < ice_starting_dominoes.length;i++) {
        iceBodies.push(ice_starting_dominoes[i]);
    }
    World.add(world, iceBodies);

    // run the engine
    Engine.run(engine);

}

var firstTime = true;

function draw() {

    // Engine.update(engine);

    // ice biome draw code

    // if (frameCount % 30 == 0) {
    //     var x = randomNumber(100, screen.availWidth - 100);
    //     var y = 20;
    //     var radius = 20;
    //     var p = new IceParticlePlinko(x, y, radius, "rgb(" + randomNumber(1, 255) + "," + randomNumber(1, 255) + "," + randomNumber(1, 255) + ")");
    //     particles.push(p);
    // }

    background(0);
    fill(255);
    stroke(255);
    drawBody(ice_starting_rectangle);
    drawBody(ice_starting_raised_rectangle);
    drawBody(second_ice_starting_rectangle);
    // for (var i = 0;i < particles.length;i++) {
    //     particles[i].show();
    // }
    // for (var i = 0;i < pegs.length;i++) {
    //     pegs[i].show();
    // }

    // drawing dominoes at the top
    for (let j = 0; j < ice_starting_dominoes.length; j++) {
        let currentDomino = ice_starting_dominoes[j].body;
        var vertices = currentDomino.vertices;
        fill(ice_starting_dominoes[j].rgb);
        stroke(ice_starting_dominoes[j].rgb);
        beginShape();
        for (var i = 0; i < vertices.length; i++) {
            vertex(vertices[i].x, vertices[i].y);
        }
        endShape();
    }

    fill(255);
    stroke(255);
    drawBody(mainBody);
    
    if (firstTime && frameCount >= 180) {
        let x = ice_starting_dominoes[0].body.position.x;
        let y = ice_starting_dominoes[0].body.position.y;
        // Body.applyForce(ice_starting_dominoes[0].body, {x: x, y: y - 75}, {x: 0.45, y: 0});
        Body.applyForce(mainBody, {x: mainBody.position.x, y: mainBody.position.y}, {x: 35, y: 0});
        firstTime = false;
        moveCamera(500, 0, 0);
    }

    ice_starting_flag.show();
}