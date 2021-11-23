const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
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
let airCameraMainBody;
let AIR_FRAMES_PER_SECOND = 30;
const AIR_OFFSET_X = 0;
const AIR_OFFSET_Y = 0;

// Sprites
let airPlaneImg;
let airPlaneBody;
let airPlainPlaneImg;
let airThrustPlaneImg;
let airPlaneShadowImg;
let airPlaneShadowBody;
let airCloudImg;
let airThunderCloudImg;

// Stupid Info
let airCloudPositionMatrix = [];
let airNumRowClouds = 30;
let airNumColClouds = 30;

// Conditions
let airConditions = [];

// Ragdoll
let airPerson;

// Trackers
let airCamZoom = 0;
let airTime = 0;
let airCamXOffset = 0;
let airCamYOffset = 0;

// Clouds
let cloud1;

// Springs
let airCloudSprings = [];
let airPastCloudSprings = false;
let airLightningImg;
let airLightningTime = 0;

// Tower
let airRadioTower;
let airRadioTowerImg;
let airRadioBeacon;
let beaconTriggered = false;
let airSignalDiameter = 0;

// Plinko
let airPlinkoPegs = [];
let airPlinkoBalls = [];
let airHelicopter;
let airHelicopterImg;
let airHelicopterBeacon;
let airBucketLeftWall;
let airBucketRightWall;
let airBucketBottom;
let airBucketBottomConstraint;

// Other Plane Crash
let airNewtonsHelicopters = [];
let airNewtonsCradle;

// Ball Drop
let airBallPlatform;
let airDropBall;
let airDropBall2;

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

// Ragdoll
let ragdollCharacter;
var ragdolls = Composite.create();

/*------------------------------ Begin Camera Functions -----------------------------------*/

function followMainBody(mainBody) {
  airCameraX = mainBody.position.x;
  airCameraY = mainBody.position.y;
  airCameraZ = 1000 - airCamZoom;
  airCamera.setPosition(
    mainBody.position.x + airCamXOffset,
    mainBody.position.y + airCamYOffset,
    1000 - airCamZoom
  );
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

function createSpring(x, y, w, h, power, lastSpring) {
  let trampoline = Bodies.rectangle(x, y, w, h);

  let leftConstraint = Constraint.create({
    bodyA: trampoline,
    pointA: Vector.create(-(w * 0.5), 0),
    pointB: Vector.add(
      Vector.create(-(w * 0.5), -(w * 0.5)),
      Matter.Vector.create(trampoline.position.x, trampoline.position.y)
    ),
    stiffness: 0.001,
    render: {
      visible: true,
    },
  });

  let rightConstraint = Constraint.create({
    bodyA: trampoline,
    pointA: Vector.create(w * 0.5, 0),
    pointB: Vector.add(
      Vector.create(w * 0.5, -(w * 0.5)),
      Matter.Vector.create(trampoline.position.x, trampoline.position.y)
    ),
    stiffness: 0.001,
    render: {
      visible: true,
    },
  });

  World.add(engine.world, [trampoline, leftConstraint, rightConstraint]);

  Events.on(engine, "collisionStart", function (data) {
    let pairs = data.pairs;
    if (pairs && pairs.length > 0) {
      for (let j = 0; j < pairs.length; j++) {
        let on = pairs[j];
        if (on.bodyB.id === trampoline.id) {
          Body.setVelocity(
            on.bodyA,
            Vector.add(
              Vector.create(10 * power, -75 * power),
              Vector.clone(on.bodyA.velocity)
            )
          );
          Body.setAngularVelocity(on.bodyA, -Math.PI / 30);
          airPastCloudSprings = lastSpring;
        }
      }
    }
  });
  return trampoline;
}

function createWindmill(x, y, towerHeight, rotationOffset) {
  windmillCoords.push([x, y - towerHeight / 2]);
  let tower = Bodies.rectangle(x, y, 50, towerHeight);
  let topOfTower = Vector.create(x, y - towerHeight / 2);
  windmillBlades = Bodies.fromVertices(
    x,
    y - towerHeight / 2,
    windmillVertices,
    { isStatic: true, friction: 0 },
    [(flagInternal = false)],
    [(removeCollinear = 0.01)],
    [(minimumArea = 10)],
    [(removeDuplicatePoints = 0.01)]
  );
  Body.rotate(windmillBlades, rotationOffset, topOfTower);
  constraint = Constraint.create({
    pointA: { x: x, y: y - towerHeight / 2 },
    bodyB: windmillBlades,
    stiffness: 1,
    length: 0,
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

function drawSpriteWithOffset(body, img, offsetX, offsetY, w, h) {
  const pos = body.position;
  push();
  translate(pos.x, pos.y);
  rotate(body.angle);
  imageMode(CENTER);
  image(img, offsetX, offsetY, w, h);
  pop();
}

// This code will error when:
//     There is no SVG file found
//     You don't import the pathseg and decomp files in your index.html
//     You're running the wrong index.html file on LiveServer (you have to right click and do it)
//     You're just not cool enough to use images in matter.js
function addSvgElement(resourcePath) {
  httpGet(resourcePath, "text", false, function (response) {
    // when the HTTP request completes ...
    const parser = new DOMParser(); // Create a new DOM parser to parse the SVG document
    const svgDoc = parser.parseFromString(response, "image/svg+xml");
    svgPathElement = svgDoc.querySelector("path");
    svgBody = bodyFromPath(svgPathElement, 180, 300, {
      isStatic: false,
      friction: 0.0,
    });
    allSvgElements.push(svgBody);
    World.add(engine.world, svgBody);
  });
}

function drawSpriteWithOffset(body, img, offsetX, offsetY, w, h) {
  const pos = body.position;
  push();
  translate(pos.x, pos.y);
  rotate(body.angle);
  imageMode(CENTER);
  image(img, offsetX, offsetY, w, h);
  pop();
}

function createPegs(x, y, rows, columns, spacing, radius) {
  var pegs = [];
  var startX = x;
  var tempX = startX + 0.5 * (spacing + 2 * radius);
  var tempY = y;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      pegs.push(new IceParticlePeg(tempX, tempY, radius));
      tempX += spacing + 2 * radius;
    }
    tempY += spacing + 2 * radius;
    if (i % 2 == 0) {
      tempX = startX;
    } else {
      tempX = startX + 0.5 * (spacing + 2 * radius);
    }
  }
  return pegs;
}

/*------------------------------ End Component Functions ------------------------------------*/
/*--------------------------------- Begin Air Conditionals --------------------------------*/

// ░█████╗░██╗██████╗░
// ██╔══██╗██║██╔══██╗
// ███████║██║██████╔╝
// ██╔══██║██║██╔══██╗
// ██║░░██║██║██║░░██║
// ╚═╝░░╚═╝╚═╝╚═╝░░╚═╝

// While it's on the carrier apply a force to the plane so that it accelerates
airConditions.push(
  new Conditional(
    () => {
      // while loop has it set to true
      return true;
    },
    () => {
      // Apply a force so that it accelerates
      image(airPlaneShadowImg, airPlaneBody.position.x - 275, 200);
      Body.applyForce(airPlaneBody, airPlaneBody.position, {
        x: 0.13,
        y: 0,
      });
    },
    () => {
      // Once it passes the carrier zoom out
      if (airPlaneBody.position.x > 4500) {
        airConditions.shift();
        airCamZoom++;
      }
    }
  )
);

// After it leaves the carrier zoom in and show the shadow
airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      // Zoom in
      airCamZoom += 1;
      // The shadow only appears near the carrier, so it'll start 175px behind the plane then go back with time (camZoom = time)
      if (airPlaneShadowImg.width > 1) {
        image(
          airPlaneShadowImg,
          airPlaneBody.position.x - 275 - airCamZoom * 1.75,
          200
        );
        airPlaneShadowImg.resize(
          airPlaneShadowImg.width * 0.999,
          airPlaneShadowImg.height * 0.999
        );
      }
      Body.applyForce(airPlaneBody, airPlaneBody.position, {
        x: 0.052,
        y: 0,
      });
    },
    () => {
      if (airCamZoom > 400) {
        airConditions.shift();
      }
    }
  )
);

// Switch image to sideways plane
airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      airPlaneImg = airPlainPlaneImg;
      Body.scale(airPlaneBody, 0.75, 0.5);
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      airCamZoom -= 1;
      airCamYOffset += 1;
      return airPlaneBody.position.x >= 15500 && airPlaneBody.velocity.y == 0;
    },
    () => {
      Body.setVelocity(airPlaneBody, Vector.create(10, 0));
      airCameraFollowMainBody = true;
      // moveCameraPan(800, 250, 250, 3); // Function Syntax: changeX, changeY, changeZ, durationInSeconds
      engine.world.gravity.y = 1;
      Body.applyForce(
        airPlaneBody,
        { x: airPlaneBody.position.x - 275, y: airPlaneBody.position.y },
        { x: 0, y: -0.25 }
      );
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return !airCameraMoving;
    },
    () => {
      airCamZoom -= 10;
      airCamYOffset -= 1;
    },
    () => {
      if (airCamZoom < -250) {
        airConditions.shift();
      }
    }
  )
);

// Thrust once past springs and angle is 45 degrees
let angle;
airConditions.push(
  new Conditional(
    () => {
      angle = Math.abs(airPlaneBody.angle) % (2 * Math.PI);
      return (
        airPastCloudSprings &&
        !airCameraMoving &&
        angle < Math.PI / 2 &&
        angle > Math.PI / 4
      );
    },
    () => {
      engine.timing.timeScale = 0.5;
      // frameRate(15);
      airCameraFollowMainBody = true;
      airCamZoom = -500;
      airPlaneImg = airThrustPlaneImg;
      Body.setAngularVelocity(airPlaneBody, 0);
      Body.applyForce(
        airPlaneBody,
        { x: airPlaneBody.position.x - 100, y: airPlaneBody.position.y },
        { x: 3, y: -2 }
      );
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      angle = Math.abs(airPlaneBody.angle) % Math.PI;
      if (angle > (-1 * Math.PI) / 40 && angle < Math.PI / 40) {
        return true;
      }
    },
    () => {
      Body.setAngularVelocity(airPlaneBody, 0);
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      Body.setVelocity(airPlaneBody, { x: 10, y: 0 });
    },
    () => {
      if (airPlaneBody.position.x > 27000) {
        airConditions.shift();
      }
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      Body.setVelocity(airPlaneBody, { x: 0, y: 0 });
      Body.applyForce(airPlaneBody, airPlaneBody.position, { x: 3, y: 0 });
      airCameraFollowMainBody = false;
      moveCameraPan(700, 0, -750, 3);
    },
    () => {
      if (Matter.SAT.collides(airPlaneBody, airNewtonsCradle.bodies[0])) {
        airConditions.shift();
      }
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      Body.setVelocity(airPlaneBody, { x: 0, y: 0 });
      Body.applyForce(airPlaneBody, airPlaneBody.position, { x: 5, y: 0 });
      airCameraFollowMainBody = false;
      moveCameraPan(700, 0, -250, 2);
    },
    () => {
      if (Matter.SAT.collides(airPlaneBody, airNewtonsCradle.bodies[0])) {
        airConditions.shift();
      }
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return !airCameraMoving;
    },
    () => {
      moveCameraPan(1000, 0, 0, 8);
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      // Matter.SAT.collides(newtonsCradle.bodies[3], newtonsCradle.bodies[2]).collided &&
      return !airCameraMoving;
    },
    () => {
      moveCameraPan(-1000, 0, 0, 8);
      World.add(engine.world, [airDropBall, airDropBall2, airBallPlatform]);
      drawBodies([airDropBall, airDropBall2, airBallPlatform]);
    },
    () => {
      airConditions.shift();
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      // Matter.SAT.collides(newtonsCradle.bodies[3], newtonsCradle.bodies[2]).collided &&
      return true;
    },
    () => {
      fill(122, 122, 122);
      drawBody(airDropBall);
      drawBody(airBallPlatform);
    },
    () => {
      if (airDropBall.velocity.y != 0) {
        airConditions.shift();
      }
    }
  )
);

airConditions.push(
  new Conditional(
    () => {
      return true;
    },
    () => {
      engine.timing.timeScale = 1;
      fill(122, 122, 122);
      noStroke();
      drawBody(airDropBall);
      drawBody(airBallPlatform);
      airCameraFollowMainBody = true;
      airCameraMainBody = airDropBall;
    },
    () => {}
  )
);

/* ------------------------------- End Air Conditionals -----------------------------------*/
/*--------------------------------- Begin P5 Functions --------------------------------------*/

function preload() {
  // create an engine
  engine = Engine.create();
  world = engine.world;

  engine.world.gravity.y = 0; // Set gravity to 0

  /*------------- Begin Clouds ---------------*/
  for (let i = 0; i < airNumRowClouds; i++) {
    let rowCloudPositions = [];
    for (let j = 0; j < airNumColClouds; j++) {
      let cloudx = 13500 + i * 50 * Math.random();
      let cloudy = -100 + j * 45 * Math.random();
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
  airPlaneBody = Bodies.circle(800, 375, 75, {
    render: {
      sprite: {
        texture: "resources/Plane.png",
      },
    },
  });
  Body.scale(airPlaneBody, 2, 2);
  setMassCentre(airPlaneBody, { x: 105, y: 0 });
  World.add(engine.world, airPlaneBody);
  airCameraMainBody = airPlaneBody;

  airPlaneShadowImg = loadImage("resources/Plane-Silhouette.png");
  airThrustPlaneImg = loadImage("resources/thrustPlane.png");

  // Add cloud trampolines
  airCloudImg = loadImage("resources/cloud.png");
  airThunderCloudImg = loadImage("resources/thunderCloud.png");
  airCloudSprings.push(createSpring(16180, 1000, 250, 10, 0.25, false));
  airCloudSprings.push(createSpring(16780, 1000, 250, 10, 0.5, false));
  airCloudSprings.push(createSpring(17380, 1000, 250, 10, 0.6, false));
  airCloudSprings.push(createSpring(17980, 1000, 250, 10, 0.5, true));
  airLightningImg = loadImage("resources/lightning.png");

  // Tower
  airRadioTowerImg = loadImage("resources/RadioTower.png");
  airRadioTower = Bodies.rectangle(18050, 1575, 300, 600, {
    isStatic: true,
  });
  airRadioBeacon = Bodies.circle(18050, 1325, 40, {
    isStatic: true,
  });

  // Plinko with Helicopter and Bucket
  airPlinkoPegs = createPegs(20900, 150, 6, 13, 175, 30); // x, y, rows, columns, spacing, radius
  airHelicopterImg = loadImage("resources/LeftHelicopter.png");
  airHelicopter = Bodies.rectangle(22500, -400, 300, 100, {
    isStatic: true,
  });
  World.add(engine.world, airHelicopter);

  airBucketLeftWall = Bodies.rectangle(22000, -100, 10, 100, {
    isStatic: true,
  });
  airBucketRightWall = Bodies.rectangle(23000, -100, 10, 100, {
    isStatic: true,
  });
  airBucketBottom = Bodies.rectangle(22500, -40, 1000, 10, {
    isStatic: true,
  });
  airHelicopterBeacon = Bodies.circle(22500, -400, 10, {
    isStatic: true,
  });

  for (let i = 0; i < 200; i++) {
    airPlinkoBalls.push(
      Bodies.circle(
        22000 + i * Math.ceil(Math.random() * 100), // x
        -300, // y
        Math.ceil(Math.random() * 50) + 10 // r
      )
    );
  }

  World.add(engine.world, [
    airBucketLeftWall,
    airBucketRightWall,
    airBucketBottom,
  ]);
  World.add(engine.world, airPlinkoBalls);

  // Add helicopter with newtons cradle
  airNewtonsHelicopters.push(
    Bodies.rectangle(28000, -450, 300, 100, { isStatic: true })
  );
  airNewtonsHelicopters.push(
    Bodies.rectangle(28490, -450, 300, 100, { isStatic: true })
  );
  airNewtonsHelicopters.push(
    Bodies.rectangle(28980, -450, 300, 100, { isStatic: true })
  );
  airNewtonsHelicopters.push(
    Bodies.rectangle(29470, -450, 300, 100, { isStatic: true })
  );

  World.add(engine.world, airNewtonsHelicopters);
  airNewtonsCradle = createNewtonsCradle(27950, -400, 4, 100, 900);
  airNewtonsCradle.bodies.forEach((element) => {
    Body.setVelocity(element, { x: 0, y: 0 });
  });
  World.add(engine.world, airNewtonsCradle.bodies);
  World.add(engine.world, airNewtonsCradle.constraints);

  // Add ball platform
  airBallPlatform = Bodies.rectangle(27800, 610, 800, 10, { isStatic: true });
  airDropBall = Bodies.circle(27650, 400, 75);
  airDropBall2 = Bodies.circle(27500, 400, 30);

  // Add windmills
  // let windmill1 = createWindmill(16500, 650, 400, 0);
  // let windmill2 = createWindmill(16800, 160, 500, Math.PI + 0.16);
  // let windmill3 = createWindmill(17100, 690, 270, 0);
  // windmills = [windmill1, windmill2, windmill3];

  //run the engine
  Engine.run(engine);
}

function draw() {
  /*------------------------ Camera Panning ---------------------------*/

  if (!airCameraFollowMainBody) {
    if (airCameraMoving) {
      airCameraX += airCameraChangeX;
      airCameraY += airCameraChangeY;
      airCameraZ += airCameraChangeZ;
      moveCamera(airCameraChangeX, airCameraChangeY, airCameraChangeZ);
      if (airCameraPanTime <= 0) {
        airCameraMoving = false;
      }
      airCameraPanTime--;
    }
  } else {
    followMainBody(airCameraMainBody);
  }

  /*---------------------- End Camera Panning ------------------------*/

  // Background Stuff
  rectMode(CENTER);
  background(43, 184, 255);
  airTime++;

  /*------------ Begin Runway ---------------*/
  if (airCamera.centerX < 12000) {
    noStroke();
    fill(115, 115, 115, 255);
    rect(0, 350, 10000, 800);
    fill(252, 186, 3);
    for (let i = 0; i < 14; i++) {
      rect(100 + i * 350, 375, 200, 50);
    }
  }
  /*-------------- End Runway ----------------*/

  /*------------ Begin Conditions ------------*/
  if (airConditions.length > 0) {
    if (airConditions[0].check()) {
      airConditions[0].onFulfill();
      airConditions[0].onFinished();
    }
  }
  /*------------- End Conditions -------------*/

  /*------------- Begin Draw Plane -----------*/
  fill(128);
  stroke(128);
  strokeWeight(2);
  // drawBody(airPlaneBody);
  drawSpriteWithOffset(
    airPlaneBody,
    airPlaneImg,
    -100,
    0,
    airPlaneBody.width,
    airPlaneBody.height
  );
  /*------------ End Draw Plane --------------*/

  /*-------------- Begin Clouds --------------*/
  if (airCameraX < 17500) {
    for (let i = 0; i < airNumRowClouds; i++) {
      for (let j = 0; j < airNumColClouds; j++) {
        image(
          airCloudImg,
          airCloudPositionMatrix[i][j][0],
          airCloudPositionMatrix[i][j][1]
        );
      }
    }
  }
  /*--------------- End Clouds ---------------*/

  /*-------------- Begin Windmill -------------*/
  for (var i = 0; i < windmills.length; i++) {
    let windmill = windmills[i];
    fill(133, 98, 1);
    drawBody(windmill[0]);
    fill(255, 255, 255);
    drawBody(windmill[1]);
  }
  /*----------------- End Windmill -------------*/

  /*-------------- Draw Springs ----------------*/
  if (airPastCloudSprings) {
    if (airLightningTime < 5) {
      image(airLightningImg, 17950, 1000);
      airCameraFollowMainBody = false;
      beaconTriggered = true;
    }
    airLightningTime++;
  }

  for (let i = 0; i < airCloudSprings.length; i++) {
    const spring = airCloudSprings[i];
    if (i != airCloudSprings.length - 1) {
      drawSpriteWithOffset(spring, airCloudImg, 0, 0, 300, 150);
    } else {
      drawSpriteWithOffset(spring, airThunderCloudImg, 0, 0, 300, 150);
    }
  }
  drawSpriteWithOffset(airRadioTower, airRadioTowerImg, 0, 0, 300, 600);
  if (beaconTriggered) {
    fill(0, 255, 0);
  } else {
    fill(255, 0, 0);
  }
  drawBody(airRadioBeacon);

  noFill();
  if (beaconTriggered && airSignalDiameter < 9850) {
    airSignalDiameter += 23;
    circle(
      18050,
      1325,
      airSignalDiameter - 100 > 0 ? airSignalDiameter - 100 : 0
    );
    circle(18050, 1325, airSignalDiameter);
  }
  /*-------------- End Springs ----------------*/

  /*-------------- Draw Plinko ----------------*/
  if (airCamera.centerX > 17500 && airCamera.centerX <= 27000) {
    for (var i = 0; i < airPlinkoPegs.length; i++) {
      airPlinkoPegs[i].show();
    }
    drawSpriteWithOffset(airHelicopter, airHelicopterImg, 0, 0, 300, 100);

    fill(255, 0, 0);
    drawBodies(airPlinkoBalls);

    fill(255);
    if (airSignalDiameter >= 9850) {
      fill(255, 0, 0);
      World.remove(engine.world, airBucketBottom);
      World.remove(engine.world, airBucketLeftWall);
      World.remove(engine.world, airBucketRightWall);
    } else {
      drawBodies([airBucketLeftWall, airBucketBottom, airBucketRightWall]);
    }
    drawBody(airHelicopterBeacon);
  }
  /*-------------- End Plinko ----------------*/

  /*------------- Begin Crash ----------------*/
  if (airCamera.centerX > 25000) {
    fill(255);
    airNewtonsCradle.constraints.forEach((element) => {
      drawConstraint(element);
    });
    drawBodies(airNewtonsCradle.bodies);
    drawSpriteWithOffset(
      airNewtonsHelicopters[0],
      airHelicopterImg,
      450,
      100,
      1200,
      300
    );
  }
  /*-------------- End Crash -----------------*/

  /*------------- Draw Ragdoll ---------------*/
  // Body.setAngle(ragdollCharacter.bodies[3], Math.PI);
  // drawBodies(ragdollCharacter.bodies);
}
