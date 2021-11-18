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
const drawSprite = Helpers.drawSprite;
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

// Sprites
let planeImg;
let planeBody;

// Camera
let cam;

// Conditions
let conditions = [];

// Ragdoll
let person;

conditions.push(new Conditional(
        () => {
            return true;
        },
        () => {
            Body.applyForce(planeBody, planeBody.position, {
                x: -0.003,
                y: 0
            })
        },
        () => {
            if(planeBody.position.y < -20) {
                conditions.shift();
            }
        }
    )
)

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
    // addSvgElement("./resources/plane.svg");
}

function setup() {
    const canvas = createCanvas(absoluteScreenWidth, absoluteScreenHeight, WEBGL);

    cam = createCamera();

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
    // Body.setStatic(bridge, true);

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

    // planeImg = loadImage("resources/planeImg.png");
    planeBody = Bodies.rectangle(800, 400, 113, 33);
    // Body.scale(planeBody, 1, 10);
    planeImg = loadImage("resources/plainPlane.png");
    World.add(engine.world, planeBody);

    hookBody = Bodies.rectangle(790, 400, 10, 200);
    World.add(engine.world, hookBody);
    
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
    bridge.bodies[bridge.bodies.length/2];

    person = createRagdoll(0, 0);

    // run the engine
    Engine.run(engine);
}

function followMainBody(mainBody) {
    cam.setPosition(mainBody.position.x, mainBody.position.y, 1000);
}

function draw() {
    rectMode(CENTER);
    
    followMainBody(planeBody);
    // translate(-width/2,-height/2,0); //moves our drawing origin to the top left corner
    background(0);
    fill(128);
    stroke(128);
    strokeWeight(2);
    drawConstraint(bridgeLeftConstraint);
    drawConstraint(bridgeRightConstraint);
    drawBodies(bridge.bodies);
    // drawBody(ball);
    drawSprite(planeBody, planeImg);

    // drawBodies(allSvgElements);

    if(conditions.length > 0) {
        if(conditions[0].check()) {
            conditions[0].onFulfill();
            conditions[0].onFinished();
        }
    }

    drawMouse(mouseConstraint);
}