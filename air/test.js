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

// Canvas vars
let absoluteScreenWidth = screen.availWidth;
let absoluteScreenHeight = screen.availHeight;

// Camera
let airCam;

let engine;
let airX = 0;
let airY = 0;

// Sprites
let airPlaneImg;
let airPlaneBody;
let airPlainPlaneImg;
let airPlaneShadowImg;
let airPlaneShadowBody;
let airCloudImg;

// Stupid Info
let airCloudPositionMatrix = [];
let airNumRowClouds = 30;
let airNumColClouds = 50;

// Conditions
let airConditions = [];

// Ragdoll
let airPerson;

// Trackers
let airCamZoom = 0;
let airTime = 0;

// While it's on the carrier apply a force to the plane so that it accelerates
airConditions.push(new Conditional(
        () => {
            // while loop has it set to true
            return true;
        },
        () => {
            // Apply a force so that it accelerates
            image(airPlaneShadowImg, airPlaneBody.position.x - 175, 200);    
            Body.applyForce(airPlaneBody, airPlaneBody.position, {
                x: 0.05,
                y: 0,
            })
        },
        () => {
            // Once it passes the carrier zoom out
            if(airPlaneBody.position.x > 4500) {
                airConditions.shift();
                airCamZoom++;
            }
        }
    )
)

// After it leaves the carrier zoom in and show the shadow
airConditions.push(new Conditional(
        () => {
            return true;
        },
        () => {
            // Zoom in
            airCamZoom += 1;
            // The shadow only appears near the carrier, so it'll start at an x and then travel slower than the plane does
            if(airPlaneShadowImg.width > 1) {
                image(airPlaneShadowImg, airPlaneBody.position.x - 175 - airCamZoom * 1.75, 200);
                airPlaneShadowImg.resize(airPlaneShadowImg.width * 0.999, airPlaneShadowImg.height * 0.999);
            }
            Body.applyForce(airPlaneBody, airPlaneBody.position, {
                x: 0.05,
                y: 0,
            })
        },
        () => {
            if(airCamZoom > 400) {
                airConditions.shift();
            }
        }
    )
)

airConditions.push(new Conditional(
        () => {
            return true;
        },
        () => {
            airPlaneImg = airPlainPlaneImg;
        },
        () => {
            airConditions.shift();
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

    /*------------- Begin Clouds ---------------*/
    for(let i = 0; i < airNumRowClouds; i++) {
        let rowCloudPositions = [];
        for(let j = 0; j < airNumColClouds; j++) {
            let cloudx = 13500 + i*50*Math.random();
            let cloudy = j*45*Math.random();
            let cloudCoords = [cloudx, cloudy];
            rowCloudPositions.push(cloudCoords);
        }
        airCloudPositionMatrix.push(rowCloudPositions);
    }
    /*------------- End Clouds -----------------*/
}

function setup() {
    const canvas = createCanvas(absoluteScreenWidth, absoluteScreenHeight, WEBGL);

    airCam = createCamera();

    //---------------- Set up the plane body---------------------
    airPlaneImg = loadImage("resources/Plane.png");
    airPlainPlaneImg = loadImage("resources/plainPlane.png");
    airPlaneBody = Bodies.rectangle(800, 375, 226, 66, {
        render: {
            sprite: {
                texture: "resources/Plane.png"
            }
        }
    });
    Body.scale(airPlaneBody, 2, 2);
    World.add(engine.world, airPlaneBody);

    airPlaneShadowImg = loadImage("resources/Plane-Silhouette.png");
    airCloudImg = loadImage("resources/cloud.png");
    
    //-------------------- setup mouse -----------------------
    const mouse = Mouse.create(canvas.elt);
    const mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    //------------------- run the engine ---------------------
    Engine.run(engine);
}

function followMainBody(mainBody) {
    airCam.setPosition(mainBody.position.x, mainBody.position.y, 1000 - airCamZoom);
}

function draw() {
    rectMode(CENTER);
    background(43, 184, 255);
    airTime++;

    followMainBody(airPlaneBody);
    // translate(-width/2,-height/2,0); //moves our drawing origin to the top left corner

    /*------------ Begin Runway ---------------*/
    noStroke();
    fill(115, 115, 115, 255);
    rect(0, 350, 10000, 800);
    fill(252, 186, 3);
    for(let i = 0; i < 14; i++) { 
        rect(100 + i * 350, 375, 200, 50);
    }
    /*-------------- End Runway ----------------*/

    /*------------ Begin Conditions ------------*/
    if(airConditions.length > 0) {
        if(airConditions[0].check()) {
            airConditions[0].onFulfill();
            airConditions[0].onFinished();
        }
    }
    /*------------- End Conditions -------------*/

    /*------------- Begin Draw Plane -----------*/
    fill(128);
    stroke(128);
    strokeWeight(2);
    drawSprite(airPlaneBody, airPlaneImg);
    /*------------ End Draw Plane --------------*/

    /*------------- Begin Clouds ---------------*/
    for(let i = 0; i < airNumRowClouds; i++) {
        for(let j = 0; j < airNumColClouds; j++) {
            image(airCloudImg, airCloudPositionMatrix[i][j][0], airCloudPositionMatrix[i][j][1]);
        }
    }
    /*------------ End Clouds ------------------*/

    drawMouse(mouseConstraint);
}