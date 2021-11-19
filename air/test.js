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
                x: 0.05,
                y: 0
            })
        },
        () => {
            if(planeBody.position.x > 8000) {
                conditions.shift();
            }
        }
    )
)

conditions.push(new Conditional(
        () => {
            console.log(planeBody.position.x);
            return planeBody.position.x > 8000;
        },
        () => {
            console.log(1000 - camZoom);
            camZoom += 1;
        },
        () => {
            if(planeBody.position.x > 15000) {
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

    planeImg = loadImage("resources/Plane.png");
    planeBody = Bodies.rectangle(800, 375, 226, 66, {
        render: {
            sprite: {
                texture: "resources/Plane.png"
            }
        }
    });
    Body.scale(planeBody, 2, 2);
    World.add(engine.world, planeBody);
    
    // setup mouse
    const mouse = Mouse.create(canvas.elt);
    const mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    // run the engine
    Engine.run(engine);
}

function followMainBody(mainBody) {
    cam.setPosition(mainBody.position.x, mainBody.position.y, 1000 - camZoom);
}

let camZoom = 0;

function draw() {
    rectMode(CENTER);
    
    followMainBody(planeBody);
    // translate(-width/2,-height/2,0); //moves our drawing origin to the top left corner
    
    background(43, 184, 255);
    noStroke();
    
    fill(115, 115, 115, 255);
    rect(0, 350, 10000, 800);

    fill(252, 186, 3);
    for(let i = 0; i < 14; i++) { 
        rect(100 + i * 350, 375, 200, 50);
    }
    
    fill(128);
    stroke(128);
    strokeWeight(2);
    drawSprite(planeBody, planeImg);

    if(conditions.length > 0) {
        if(conditions[0].check()) {
            conditions[0].onFulfill();
            conditions[0].onFinished();
        }
    }

    drawMouse(mouseConstraint);
}