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

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const bodyFromPath = Helpers.bodyFromPath;
//^^ I have no idea what the difference is between this one and the one above
//^^ Update, I think that's just to draw multiple bodies at hence (since a bridge is made of multiple bodies of rects)
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;

// the top screw on
let topConstraint;
let bottomConstraint;
let constraint4;

//Bridge Var's
let bridge;

let bridgeLeftConstraint;
let bridgeRightConstraint;

// Canvas vars
let absoluteScreenWidth = screen.availWidth;
let absoluteScreenHeight = screen.availHeight;

// Stupid stuff
let ball;

let allSvgElements = [];

// This code will error when:
    //     There is no SVG file found
    //     You don't import the pathseg and decomp files in your index.html
    //     You're running the wrong index.html file on LiveServer (you have to right click and do it)
    //     You're just not cool enough to use images in matter.js
function addSvgElement(resourcePath) {
    httpGet(resourcePath, "text", false, function(response) {
        // when the HTTP request completes ...
        const parser = new DOMParser();  // Create a new DOM parser to parse the SVG document
        const svgDoc = parser.parseFromString(response, "image/svg+xml"); 
        svgPathElement = svgDoc.querySelector("path");
        svgBody = bodyFromPath(svgPathElement, 180, 300, { isStatic: false, friction: 0.0 });
        allSvgElements.push(svgBody);
        World.add(engine.world, svgBody);
    });
}

function preload() {
    // create an engine
    engine = Engine.create();
    world = engine.world;

    engine.world.gravity.y = 0; // Set gravity to 0
    addSvgElement("./resources/plane.svg");
}

function setup() {
    const canvas = createCanvas(absoluteScreenWidth, absoluteScreenHeight);

    

    //------------------------Bridge Stuff Start------------------------//

    // adding bridge
    const group = Body.nextGroup(true);
    const rects = Composites.stack(100, 102, 1, 30, 10, 10, function(x, y) {
        //stack syntax: xx, yy, col, row, colGap, rowGap, callback
        return Bodies.rectangle(x, y, 10, 10, { 
            collisionFilter: { group: group },
            // isStatic: true,
        });
    });
    bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 1.0, length: 1.0, render: {type: 'line'}});
    //Composites syntax: composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options(Ie stiffness, length, etc)
    World.add(engine.world, [bridge]);

    // left and right fix point of slingshot

    bridgeLeftConstraint = Constraint.create({
      pointA: {x: 175, y: 100}, // Original point
      bodyB: rects.bodies[0],
      pointB: {x: 0, y: 0},
      stiffness: 0.05
    })

    Composite.add(rects, bridgeLeftConstraint);

    bridgeRightConstraint = Constraint.create({
      pointA: {x: 175, y: 625},
      bodyB: rects.bodies[rects.bodies.length-1],
      pointB: {x: 0, y: 0},
      stiffness: 0.05
    })
    Composite.add(rects, bridgeRightConstraint);

    // add ball
    ball = Bodies.circle(400, 400, 20);
    World.add(engine.world, [ball]);
    
    // setup mouse
    const mouse = Mouse.create(canvas.elt);
    const mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    //--------------------- Begin forces setup -------------------------//
    bridge.bodies[bridge.bodies.length/2]

    // path = bodyFromPath(svgPathElement, 180, 300, { isStatic: true, friction: 0.0 });
    // World.add(engine.world, [path]);

    // run the engine
    Engine.run(engine);
}

function draw() {
    background(0);
    noStroke();
    fill(128);
    stroke(128);
    strokeWeight(2);
    drawConstraint(bridgeLeftConstraint);
    drawConstraint(bridgeRightConstraint);
    drawBodies(bridge.bodies);
    drawBody(ball);

    drawBodies(allSvgElements);

    drawMouse(mouseConstraint);
}