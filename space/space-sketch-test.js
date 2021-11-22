/* ----Imports---------------------------------------------------- */
const Engine = Matter.Engine;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Runner = Matter.Runner;
const Events = Matter.Events;
const Render = Matter.Render;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const drawSprite = Helpers.drawSprite;
/* ----Engine------------------------------------------------------ */
let engine;
engine = Engine.create();
let screenTop;
var allObjects = [];
let mainBody;
var followingMainBody = true;
/* ----Rocket-------------------------------------------------------*/
let rocketImg;
let rocketBody;
/* ----Gravity------------------------------------------------------*/
var gravityObjects = [];
var gameGravity = 0.001;
var lastTimeStamp = 0;
function gravity() {
  var length = gravityObjects.length;
  // compare two balls - because every object is attracted to another
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      // assuming they are not the same thing
      if (i != j) {
        var Dx = gravityObjects[j].position.x - gravityObjects[i].position.x;
        var Dy = gravityObjects[j].position.y - gravityObjects[i].position.y;
        var force =
          ((engine.timing.timestamp - lastTimeStamp) *
            gameGravity *
            gravityObjects[j].mass *
            gravityObjects[i].mass) /
          Math.sqrt(Dx * Dx + Dy * Dy);
        var angle = Math.atan2(Dy, Dx);
        gravityObjects[i].force.x += force * Math.cos(angle);
        gravityObjects[i].force.y += force * Math.sin(angle);
      }
    }
  }
  lastTimeStamp = engine.timing.timestamp;
}

/* ----Circular Orbit-----------------------------------------------*/
var ball = [];
var circularOrbitObjects = [];
var orbitProperties = {
  width: screen.width, //1200,
  height: screen.height, //800,
  amount: 5, //slows around 100 balls
  gravity: 0.001,
  gravityAddition: 0,
  ballSize: 10,
  friction: 0,
  frictionStatic: 1,
  frictionAir: 0,
  restitution: 0.5,
  velocityVector: true,
  lastTimeStamp: 0,
};
function preMadeBody(x, y, r, sides, Vx, Vy) {
  var i = ball.length;
  ball.push();
  ball[i] = Bodies.polygon(x, y, sides, r, {
    friction: orbitProperties.friction,
    frictionStatic: orbitProperties.frictionStatic,
    frictionAir: orbitProperties.frictionAir,
    restitution: orbitProperties.restitution,
  });
  Matter.Body.setVelocity(ball[i], {
    x: Vx,
    y: Vy,
  });
  World.add(engine.world, ball[i]);
  circularOrbitObjects.push(ball[i]);
}
function circularOrbit() {
  var length = circularOrbitObjects.length;
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      if (i != j) {
        var Dx =
          circularOrbitObjects[j].position.x -
          circularOrbitObjects[i].position.x;
        var Dy =
          circularOrbitObjects[j].position.y -
          circularOrbitObjects[i].position.y;
        var force =
          ((engine.timing.timestamp - orbitProperties.lastTimeStamp) *
            orbitProperties.gravity *
            circularOrbitObjects[j].mass *
            circularOrbitObjects[i].mass) /
          Math.sqrt(Dx * Dx + Dy * Dy);
        var angle = Math.atan2(Dy, Dx);
        circularOrbitObjects[i].force.x += force * Math.cos(angle);
        circularOrbitObjects[i].force.y += force * Math.sin(angle);
      }
    }
  }
  orbitProperties.lastTimeStamp = engine.timing.timestamp;
}
/* ----Black Hole----------------------------------------------------*/
let blackHole;
let blackHoleImg;
/* ----Ending Sequence-----------------------------------------------*/
let blackHoleObjects = [];
let leftRect;
let rightRect;
let topRect;
let bottomRect;
let smallAsteroid;
let smallAsteroids = [];
let smallBrown;
let smallBrowns = [];
let smallBlue;
let smallBlues = [];
let smallRed;
let smallReds = [];
let smallOrange;
let smallOranges = [];

let topBound;
let bottomBound;
let rightBound;
let leftBound;

let endSlide;
let endSlideImg;
var showingEndingSequence = false;
/* ----Conditions Class----------------------------------------------*/
var conditions = [];
class Conditions {
  constructor(checkFunction, notDoneFunction, onceDoneFunction) {
    this.check = checkFunction;
    this.notDone = notDoneFunction;
    this.onceDone = onceDoneFunction;
  }
}
/* ----Conditions----------------------------------------------------*/
conditions.push(
  new Conditions(
    () => {
      // when the game starts
      return rocketBody.position.y < 100000;
    },
    () => {},
    () => {
      // make the .rocket ship the center of gravity
      rocketBody.mass = 100;
      // rocketBody.isStatic = true;
      followingMainBody = false;
      gravityObjects.push(rocketBody);
    }
  )
);
conditions.push(
  new Conditions(
    () => {
      // when there is 100 balls collided
      return blackHoleObjects.length > 100;
    },
    () => {
      // randomly add balls to the screen and get them into the gravty component
      let leftX = rocketBody.position.x - screen.availWidth / 2;
      let topY = rocketBody.position.y - screen.availHeight / 2;
      var randomX = Math.random() * screen.availWidth + leftX;
      var randomY = Math.random() * screen.availHeight + topY;

      var random = Math.random();
      var b;
      if (random < 0.2) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        smallAsteroids.push(b);
      } else if (random < 0.4) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        smallReds.push(b);
      } else if (random < 0.6) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        smallOranges.push(b);
      } else if (random < 0.8) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        smallBlues.push(b);
      } else {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        smallBrowns.push(b);
      }
      World.add(engine.world, b);
      blackHoleObjects.push(b);
      gravityObjects.push(b);

      Body.setAngularVelocity(rocketBody, Math.PI / 6);
      // run the gravity function
      gravity();
    },
    () => {
      // explode all of the balls outward
      gravityObjects = [];
      blackHoleObject = [];
      smallAsteroids = [];
      smallBlues = [];
      smallBrowns = [];
      smallReds = [];
      smallOranges = [];
      blackHoleObjects.forEach((element) => {
        element.isStatic = true;
      });
      World.clear(engine.world);
      World.add(engine.world, [ragdolls]);
      showingEndingSequence = true;
      rocketBody.position.x = rocketBody.position.x - 50000;
      rocketBody.position.y = rocketBody.position.y - 50000;
    }
  )
);
/* ----Ragdoll-------------------------------------------------------*/
let ragdollCharacter;
var ragdolls = Composite.create();
function createRagdoll(x, y, scale, options) {
  scale = typeof scale === "undefined" ? 1 : scale;

  var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Common = Matter.Common;

  var headOptions = Common.extend(
    {
      label: "head",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale],
      },
      render: {
        fillStyle: "#FFFFFF",
      },
    },
    options
  );

  var chestOptions = Common.extend(
    {
      label: "chest",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale],
      },
      render: {
        fillStyle: "#FFFFFF",
      },
    },
    options
  );

  var leftArmOptions = Common.extend(
    {
      label: "left-arm",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: "#FFFFFF2",
      },
    },
    options
  );

  var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  var rightArmOptions = Common.extend(
    {
      label: "right-arm",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: "#FFFFFF",
      },
    },
    options
  );

  var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  var leftLegOptions = Common.extend(
    {
      label: "left-leg",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: "#FFFFFF",
      },
    },
    options
  );

  var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  var rightLegOptions = Common.extend(
    {
      label: "right-leg",
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      chamfer: {
        radius: 10 * scale,
      },
      render: {
        fillStyle: "#FFFFFF",
      },
    },
    options
  );

  var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  var head = Bodies.rectangle(
    x,
    y - 60 * scale,
    34 * scale,
    40 * scale,
    headOptions
  );
  var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
  var rightUpperArm = Bodies.rectangle(
    x + 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    rightArmOptions
  );
  var rightLowerArm = Bodies.rectangle(
    x + 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    rightLowerArmOptions
  );
  var leftUpperArm = Bodies.rectangle(
    x - 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    leftArmOptions
  );
  var leftLowerArm = Bodies.rectangle(
    x - 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    leftLowerArmOptions
  );
  var leftUpperLeg = Bodies.rectangle(
    x - 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    leftLegOptions
  );
  var leftLowerLeg = Bodies.rectangle(
    x - 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    leftLowerLegOptions
  );
  var rightUpperLeg = Bodies.rectangle(
    x + 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    rightLegOptions
  );
  var rightLowerLeg = Bodies.rectangle(
    x + 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    rightLowerLegOptions
  );

  var chestToRightUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 24 * scale,
      y: -23 * scale,
    },
    pointB: {
      x: 0,
      y: -8 * scale,
    },
    bodyB: rightUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var chestToLeftUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -24 * scale,
      y: -23 * scale,
    },
    pointB: {
      x: 0,
      y: -8 * scale,
    },
    bodyB: leftUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var chestToLeftUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -10 * scale,
      y: 30 * scale,
    },
    pointB: {
      x: 0,
      y: -10 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var chestToRightUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 10 * scale,
      y: 30 * scale,
    },
    pointB: {
      x: 0,
      y: -10 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var upperToLowerRightArm = Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 0,
      y: 15 * scale,
    },
    pointB: {
      x: 0,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var upperToLowerLeftArm = Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: 0,
      y: 15 * scale,
    },
    pointB: {
      x: 0,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var upperToLowerLeftLeg = Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: 0,
      y: 20 * scale,
    },
    pointB: {
      x: 0,
      y: -20 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var upperToLowerRightLeg = Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: 0,
      y: 20 * scale,
    },
    pointB: {
      x: 0,
      y: -20 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var headContraint = Constraint.create({
    bodyA: head,
    pointA: {
      x: 0,
      y: 25 * scale,
    },
    pointB: {
      x: 0,
      y: -35 * scale,
    },
    bodyB: chest,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  var legToLeg = Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: rightLowerLeg,
    stiffness: 0.01,
    render: {
      visible: false,
    },
  });

  var person = Composite.create({
    bodies: [
      chest,
      head,
      leftLowerArm,
      leftUpperArm,
      rightLowerArm,
      rightUpperArm,
      leftLowerLeg,
      rightLowerLeg,
      leftUpperLeg,
      rightUpperLeg,
    ],
    constraints: [
      upperToLowerLeftArm,
      upperToLowerRightArm,
      chestToLeftUpperArm,
      chestToRightUpperArm,
      headContraint,
      upperToLowerLeftLeg,
      upperToLowerRightLeg,
      chestToLeftUpperLeg,
      chestToRightUpperLeg,
      legToLeg,
    ],
  });

  return person;
}
/* ----Draw and Setup -----------------------------------------------*/
var music;

function preload() {
  // load all of the images for the objects in the screen
  smallAsteroid = loadImage("small-asteroid.png");
  smallOrange = loadImage("orange-planet-small.png");
  smallBrown = loadImage("small-brown-planet.png");
  smallBlue = loadImage("blue-planet-small.png");
  smallRed = loadImage("small-red-planet.png");
  endSlideImg = loadImage("end slide.png");
}

function setup() {
  createCanvas(screen.availWidth, screen.availHeight, WEBGL);

  cam = createCamera();
  // create an engine
  //engine.world.gravity.x = 0.5;
  engine.velocityIterations = 4;
  engine.positionIterations = 6;
  engine.world.gravity.y = 0;
  // xx, yy, sides, radius?

  rocketBody = Bodies.rectangle(350, 0, 150, 60);
  rocketBody.mass = 9;
  rocketImg = loadImage("rocket-ship-image.png");
  mainBody = rocketBody;
  World.add(engine.world, rocketBody);
  //World.add(engine.world, blackHole);

  for (var i = 0; i < 1; i += 1) {
    ragdollCharacter = createRagdoll(0 - screen.availWidth / 2 - 75, 0, 1.3);
    Composite.add(ragdolls, ragdollCharacter);
  }

  endSlide = Bodies.rectangle(0 + 350, 0, 960, 720);

  // create the bounds
  let leftX = rocketBody.position.x - screen.availWidth / 2;
  let rightX = rocketBody.position.x + screen.availWidth / 2;
  let topY = rocketBody.position.y - screen.availHeight / 2;
  let bottomY = rocketBody.position.y + screen.availHeight / 2;

  topRect = Bodies.rectangle((leftX + rightX) / 2, topY, screen.availWidth, 50);
  topRect.isStatic = true;
  bottomRect = Bodies.rectangle(
    (leftX + rightX) / 2,
    bottomY,
    screen.availWidth,
    50
  );
  bottomRect.isStatic = true;
  leftRect = Bodies.rectangle(
    leftX,
    (topY + bottomY) / 2,
    50,
    screen.availHeight
  );
  leftRect.isStatic = true;
  rightRect = Bodies.rectangle(
    rightX,
    (topY + bottomY) / 2,
    50,
    screen.availHeight
  );
  rightRect.isStatic = true;
  World.add(engine.world, [topRect, bottomRect, leftRect, rightRect]);
  // run the engine
  Engine.run(engine);
}

function moveWithMainBody(mainBody) {
  cam.setPosition(mainBody.position.x, mainBody.position.y, 1000);
}

function draw() {
  if (followingMainBody) {
    moveWithMainBody(mainBody);
  }

  if (conditions.length > 0) {
    if (conditions[0].check()) {
      conditions[0].onceDone();
      conditions.shift();
    } else {
      conditions[0].notDone();
    }
  }

  background(0);
  fill(128);
  drawSprite(rocketBody, rocketImg);

  smallAsteroids.forEach((element) => {
    drawSprite(element, smallAsteroid);
  });
  smallBlues.forEach((element) => {
    drawSprite(element, smallBlue);
  });
  smallBrowns.forEach((element) => {
    drawSprite(element, smallBrown);
  });
  smallReds.forEach((element) => {
    drawSprite(element, smallRed);
  });
  smallOranges.forEach((element) => {
    drawSprite(element, smallOrange);
  });

  if (showingEndingSequence) {
    Body.setAngularVelocity(ragdollCharacter.bodies[0], Math.PI / 125);
    Body.setVelocity(ragdollCharacter.bodies[0], { x: 0.9, y: 0 });
    fill(255, 255, 255);
    drawBodies(ragdollCharacter.bodies);
    drawSprite(endSlide, endSlideImg);
  }
}
