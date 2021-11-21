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

// Camera
let airCamera;
let airCameraX = 0;
let airCameraY = 0;
let airCameraZ = 0;
let airCameraChangeX = 0;
let airCameraChangeY = 0;
let airCameraChangeZ = 0;
let airCameraPanTime;
let airCameraMoving = false;
let airCameraFollowMainBody = true;
let AIR_FRAMES_PER_SECOND = 30;
const AIR_OFFSET_X = 0;
const AIR_OFFSET_Y = 0;

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

// Clouds
let cloud1;

// Windmills
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
let windmillBlades;

/*---------------------------- Begin Air Conditionals ---------------------------------*/

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
            // The shadow only appears near the carrier, so it'll start 175px behind the plane then go back with time (camZoom = time)
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

// Switch image to sideways plane
airConditions.push(new Conditional(
        () => {
            return true;
        },
        () => {
            airPlaneImg = airPlainPlaneImg;
            console.log(airPlaneBody.position.x);
            setMassCentre(airPlaneBody, {x: 1000, y: 0});
            console.log(airPlaneBody.position.x);
        },
        () => {
            airConditions.shift();
        }
    )
)

airConditions.push(new Conditional(
        () => {
            return airPlaneBody.position.x >= 15600;
        },
        () => {
            Body.setVelocity(airPlaneBody, Vector.create(0, 0));
            airCameraFollowMainBody = false;
            moveCameraPan(550, 0, 500, 5); // Function Syntax: changeX, changeY, changeZ, durationInSeconds
        },
        () => {
            airConditions.shift();
        }
    )
)

/* ------------------------------- End Air Conditionals -----------------------------------*/
/*------------------------------ Begin Camera Functions -----------------------------------*/

function followMainBody(mainBody) {
    airCameraX = mainBody.position.x;
    airCameraY = mainBody.position.y;
    airCameraZ = 1000 - airCamZoom;
    airCamera.setPosition(mainBody.position.x, mainBody.position.y, 1000 - airCamZoom);
}

function moveCameraPan(changeX, changeY, changeZ, durationInSeconds) {
    airCameraMoving = true;
    var totalFrames = durationInSeconds * AIR_FRAMES_PER_SECOND;
    airCameraPanTime = totalFrames;
    airCameraChangeX = changeX / totalFrames;
    airCameraChangeY = changeY / totalFrames;
    airCameraChangeZ = changeZ / totalFrames;
}

function moveCamera(changeX, changeY, changeZ) {
    airCameraX += changeX;
    airCameraY += changeY;
    airCameraZ += changeZ;
    airCamera.move(changeX, changeY, changeZ);
}

/*---------------------------------- End Camera Functions ---------------------------------*/
/* ----------------------------- Begin Component Functions --------------------------------*/

function createSpring(x, y, w, h, power) {
    let trampoline = Bodies.rectangle(x, y, w, h)

    let leftConstraint = Constraint.create({
        bodyA: trampoline,
        pointA: Vector.create(-(w * 0.5), 0),
        pointB: Vector.add(Vector.create(-(w * 0.5), -(w * 0.5)), Matter.Vector.create(trampoline.position.x, trampoline.position.y)),
        stiffness: 0.001,
        render: {
            visible: false,
        }
    })

    let rightConstraint = Constraint.create({
        bodyA: trampoline,
        pointA: Vector.create((w * 0.5), 0),
        pointB: Vector.add(Vector.create((w * 0.5), -(w * 0.5)), Matter.Vector.create(trampoline.position.x, trampoline.position.y)),
        stiffness: 0.001,
        render: {
            visible: false,
        }
    })

    World.add(engine.world, [trampoline, leftConstraint, rightConstraint])

    Events.on(engine, "collisionStart", function (data) {
        let pairs = data.pairs;
        if (pairs && pairs.length > 0) {
            for (let j = 0; j < pairs.length; j++) {
                let on = pairs[j];
                if (on.bodyB.id === trampoline.id) {
                    Body.setVelocity(on.bodyA, Vector.add(Vector.create(10 * power, -50 * power), Vector.clone(on.bodyA.velocity)))
                }
            }
        }
    })
}

function createWindmill(x, y, towerHeight, rotationOffset) {
    windmillCoords.push([x, y - towerHeight/2]);
    let tower = Bodies.rectangle(x, y, 50, towerHeight);
    let topOfTower = Vector.create(x, y - towerHeight / 2);
    windmillBlades = Bodies.fromVertices(
        x,
        y - towerHeight / 2,
        windmillVertices, 
        { isStatic: true, friction: 0 }, 
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

function setMassCentre(body, offset) {
    body.position.x += offset.x;
    body.position.y += offset.y;
    body.positionPrev.x += offset.x;
    body.positionPrev.y += offset.y;
}

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

/*------------------------------ End Component Functions ------------------------------------*/
/*--------------------------------- Begin P5 Functions --------------------------------------*/

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
    createCanvas(absoluteScreenWidth, absoluteScreenHeight, WEBGL);

    /*------------ Camera Setup ----------------*/
    airCamera = createCamera();
    airCameraX = airCamera.centerX;
    airCameraY = airCamera.centerY;
    airCameraZ = airCamera.centerZ;

    /*---------------- Set up the plane body---------------------*/
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
    
    // Add components such as springs and windmills
    createSpring(16000, 50, 100, 100, 0);
    let windmill1 = createWindmill(16500, 650, 400, 0);
    let windmill2 = createWindmill(16800, 160, 500, Math.PI + 0.16);
    let windmill3 = createWindmill(17100, 690, 270, 0);
    windmills = [windmill1, windmill2, windmill3];

    //run the engine
    Engine.run(engine);
}

function draw() {

    /*------------------------ Camera Panning ---------------------------*/

    if(!airCameraFollowMainBody) {
        if (airCameraMoving) {
            airCameraX += airCameraChangeX;
            airCameraY += airCameraChangeY;
            airCameraZ += airCameraChangeZ;
            moveCamera(airCameraChangeX, airCameraChangeY, airCameraChangeZ);
            if(airCameraPanTime <= 0){
                airCameraMoving = false;
            }
            airCameraPanTime--;
        }
    } else {
        followMainBody(airPlaneBody);
    }

    /*---------------------- End Camera Panning ------------------------*/

    // Background Stuff
    rectMode(CENTER);
    background(43, 184, 255);
    airTime++;
    
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
    
    fill('red');
    ellipse(airPlaneBody.position.x, airPlaneBody.position.y, 10, 10);
    /*------------ End Draw Plane --------------*/

    /*-------------- Begin Clouds --------------*/
    for(let i = 0; i < airNumRowClouds; i++) {
        for(let j = 0; j < airNumColClouds; j++) {
            image(airCloudImg, airCloudPositionMatrix[i][j][0], airCloudPositionMatrix[i][j][1]);
        }
    }
    /*--------------- End Clouds ---------------*/

    /*-------------- Draw Windmill -------------*/
    /*-------------- Draw Windmill -------------*/
    for(var i = 0; i < windmills.length; i++) {
        let windmill = windmills[i];
        // Body.setPosition(windmill, windmillCoords[i][0], windmillCoords[i][1]);
        fill(133, 98, 1);
        drawBody(windmill[0]);
        fill(255, 255, 255);
        drawBody(windmill[1]);
    }
}