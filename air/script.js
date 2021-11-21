const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Events = Matter.Events;
const Vector = Matter.Vector;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const bodyFromPath = Helpers.bodyFromPath;
const drawSprite = Helpers.drawSprite;
const drawConstraint = Helpers.drawConstraint;

let engine;

// Canvas vars
let absoluteScreenWidth = window.innerWidth;
let absoluteScreenHeight = window.innerHeight;

let windmills = [];
let windmillCoords = [];

let windmillVertices = [
    { x: 5, y: 5 },
    { x: 50, y: 5 },
    { x: 50, y: 55 },
    { x: 200, y: 55 },
    { x: 200, y: 5 },
    { x: 200, y: -5 },
    { x: 5, y: -5 },
    { x: 5, y: -50 },
    { x: 55, y: -50 },
    { x: 55, y: -200 },
    { x: 5, y: -200 },
    { x: -5, y: -200 },
    { x: -5, y: -5 },
    { x: -50, y: -5 },
    { x: -50, y: -55 },
    { x: -200, y: -55 },
    { x: -200, y: -5 },
    { x: -200, y: 5 },
    { x: -5, y: 5 },
    { x: -5, y: 50 },
    { x: -55, y: 50 },
    { x: -55, y: 200 },
    { x: -5, y: 200 },
    { x: 5, y: 200 },
];

function createWindmill(x, y, towerHeight, rotationOffset) {
    windmillCoords.push([x, y - towerHeight/2]);
    let tower = Bodies.rectangle(x, y, 50, towerHeight);
    let topOfTower = Vector.create(x, y - towerHeight / 2);
    windmillBlades = Bodies.fromVertices(
        x,
        y - towerHeight / 2,
        windmillVertices, 
        { isStatic: false, friction: 0, restitution: 0.1 }, 
        [flagInternal=false], 
        [removeCollinear=0.01], 
        [minimumArea=10], 
        [removeDuplicatePoints=0.01]
    );
    Body.rotate(windmillBlades, rotationOffset, topOfTower);
    constraint = Constraint.create({
        pointA: {x: x, y: y - towerHeight/2},
        bodyB: windmillBlades,
        stiffness: 1,
        length: 0
    });
    World.add(engine.world, [windmillBlades, constraint]);
    return [tower, windmillBlades];
}

function preload() {
    // create an engine
    engine = Engine.create();
    world = engine.world;

    engine.world.gravity.y = 0;
}

let testPlane;
function setup() {
    createCanvas(absoluteScreenWidth, absoluteScreenHeight, WEBGL);

    let windmill1 = createWindmill(-300, 350, 400, 0);
    let windmill2 = createWindmill(0, 360, 310, Math.PI/4 + 0.16);
    let windmill3 = createWindmill(500, 390, 270, 0);
    windmills = [windmill1, windmill2, windmill3];

    testPlane = Bodies.rectangle(-700, 10, 100, 25);
    World.add(engine.world, testPlane);
    // Body.applyForce(testPlane, testPlane.position, {
    //     x: 0.1, 
    //     y: 0
    // })
    Body.setAngularVelocity(windmill1[1], 0.2);

    //run the engine
    Engine.run(engine);
}

function draw() {
    // Background Stuff
    background(43, 184, 255);
    noStroke();

    /*-------------- Draw Windmill -------------*/
    for(var i = 0; i < windmills.length; i++) {
        let windmill = windmills[i];
        // Body.setPosition(windmill, windmillCoords[i][0], windmillCoords[i][1]);
        fill(133, 98, 1);
        drawBody(windmill[0]);
        fill(255, 255, 255);
        drawBody(windmill[1]);
    }

    drawBody(testPlane);
    drawBody(windmillBlades);
}
