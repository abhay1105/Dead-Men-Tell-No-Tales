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
/* ----Planets------------------------------------------------------*/
let greyPlanet;
let greyPlanetImg;
let bluePlanet;
let bluePlanetImg;
let redPlanet;
let redPlanetImg;
let brownPlanet;
let brownPlanetImg;
let orangePlanet;
let orangePlanetImg;
/* ----Rocket-------------------------------------------------------*/
let rocketImg;
let rocketBody;
/* ----Sun----------------------------------------------------------*/
let sun;
let sunImg;
let explosionImg;
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
/* ----Plinko-------------------------------------------------------*/
var particles = [];
var plinkos = [];
var bounds = [];
function getY(j) {
  if (j == 12) {
    return 100;
  } else if (j == 11) {
    return 150;
  } else if (j == 10) {
    return 200;
  } else if (j == 9) {
    return 250;
  } else if (j == 8) {
    return 300;
  } else {
    return 350;
  }
}

function newParticle(x, y) {
  var p = new Particle(x, y, 10);
  particles.push(p);
}
/* ----Circular Orbit-----------------------------------------------*/
var ball = [];
var circularOrbitObjects = [];
var orbitProperties = {
  width: screen.width, //1200,
  height: screen.height, //800,
  amount: 5, //slows around 100 balls
  gravity: 0.001,
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
/* ----Vacuum--------------------------------------------------------*/
let topBound;
let bottomBound;
let rightBound;
let leftBound;
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
// pass the first planet
conditions.push(
  new Conditions(
    () => {
      return rocketBody.position.x > greyPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      gravityObjects.push(rocketBody, greyPlanet, bluePlanet);
    }
  )
);
// pass the second planet
conditions.push(
  new Conditions(
    () => {
      return rocketBody.position.x > bluePlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      gravityObjects.push(rocketBody, bluePlanet, redPlanet);
    }
  )
);
// pass the third planet
conditions.push(
  new Conditions(
    () => {
      return rocketBody.position.x > redPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      gravityObjects.push(rocketBody, redPlanet, brownPlanet);
    }
  )
);
// pass the fourth planet
conditions.push(
  new Conditions(
    () => {
      return rocketBody.position.x > brownPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      gravityObjects.push(rocketBody, brownPlanet, orangePlanet);
    }
  )
);
// pass the fifth planet
conditions.push(
  new Conditions(
    () => {
      return rocketBody.position.x > orangePlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      gravityObjects.push(rocketBody, orangePlanet, sun);
    }
  )
);
// collides with the sun
conditions.push(
  new Conditions(
    () => {
      return Matter.SAT.collides(rocketBody, sun).collided;
    },
    () => {
      Body.setVelocity(rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      gravityObjects = [];
      rocketBody.mass = 0.07347;
      gravityObjects.push(rocketBody, blackHole);
    }
  )
);
// within striking distance of the black hole
conditions.push(
  new Conditions(
    () => {
      var xDist = rocketBody.position.x - blackHole.position.x;
      var yDist = rocketBody.position.y - blackHole.position.y;
      var dist = Math.sqrt(yDist * yDist + xDist * xDist);
      return dist < 500;
    },
    () => {
      gravity();
    },
    () => {
      rocketBody.mass = 0.07347;
      Body.setVelocity(rocketBody, { x: 0, y: 0 });
      // clear all of the current actions
      gravityObjects = [];
      circularOrbitObjects.push(rocketBody);
      // plinkos = [];
      // blackHole = null;

      // entering the black hole
      // turn on the gravity
      //gravityObjects.push(rocketBody, bottomBound);
      // draw all of the colorful balls and things that are getting vacuumed along with the rocket
    }
  )
);
// conditions.push(
//   new Conditions(
//     () => {
//       return Matter.SAT.collides(rocketBody, bottomBound).collided;
//     },
//     () => {
//       console.log(rocketBody.position);
//       gravity();
//     },
//     () => {}
//   )
// );
/* ----Draw and Setup -----------------------------------------------*/
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

  World.add(engine.world, rocketBody);

  orangePlanetImg = loadImage("greyPlanet.png");

  greyPlanetImg = loadImage("greyPlanet.png");
  greyPlanet = Bodies.circle(1700, 750, 150);
  greyPlanet.mass = 250;
  greyPlanet.isStatic = true;

  bluePlanetImg = loadImage("bluePlanet.png");
  bluePlanet = Bodies.circle(3200, -550, 256);
  bluePlanet.mass = 500;
  bluePlanet.isStatic = true;

  redPlanetImg = loadImage("redPlanet.png");
  redPlanet = Bodies.circle(5700, 750, 256);
  redPlanet.mass = 750;
  redPlanet.isStatic = true;

  brownPlanetImg = loadImage("brownPlanet.png");
  brownPlanet = Bodies.circle(9300, -550, 300);
  brownPlanet.mass = 1000;
  brownPlanet.isStatic = true;

  orangePlanetImg = loadImage("orangePlanet.png");
  orangePlanet = Bodies.circle(13800, 750, 400);
  orangePlanet.mass = 1250;
  orangePlanet.isStatic = true;
  // add all of the bodies to the world
  World.add(engine.world, [
    greyPlanet,
    bluePlanet,
    redPlanet,
    brownPlanet,
    orangePlanet,
  ]);
  allObjects.push(greyPlanet, bluePlanet, redPlanet, brownPlanet, orangePlanet);

  // sun
  sun = Bodies.circle(20000, 1500, 709);
  sunImg = loadImage("sun.png");
  sun.isStatic = true;
  sun.restitution = 1;
  World.add(engine.world, sun);
  allObjects.push(sun);

  gravityObjects.push(rocketBody);
  gravityObjects.push(greyPlanet);

  // plinko
  world = engine.world;

  // randomly adds plinko to the screen (asteroids)
  for (var x = 0; x < 100; x += 1) {
    xVal = Math.floor(Math.random() * 6000) + 15000;
    yVal = -Math.floor(Math.random() * 1000) - 1000;
    plinko = new Plinko(xVal, yVal, Math.random() * 40 + 10);
    plinkos.push(plinko);
    allObjects.push(plinko);
  }

  //  black hole
  var blackHoleX = 16500 + 1500;
  var blackHoleY = -7500;
  blackHole = Bodies.circle(blackHoleX, blackHoleY, 200);
  blackHole.mass = 500;
  blackHole.restitution = 0;
  blackHole.isStatic = true;
  blackHoleImg = loadImage("blackHole.png");
  //World.add(engine.world, blackHole);

  ball = [];
  preMadeBody(blackHoleX, blackHoleY, 50, 0, 0, 0);
  preMadeBody(blackHoleX - 300, blackHoleY, 5, 0, 0, 6);
  preMadeBody(blackHoleX, blackHoleY + 250, 5, 0, 6, 0);
  preMadeBody(blackHoleX + 200, blackHoleY, 5, 0, 0, -6);
  preMadeBody(blackHoleX, blackHoleY - 300, 5, 0, -6, 0);
  // vacuum
  topBound = Bodies.rectangle(16500 + 1500 + 10000, -2250 - 1000, 10000, 15);
  topBound.restitution = 1;
  topBound.isStatic = true;
  bottomBound = Bodies.rectangle(16500 + 1500 + 10000, -2250 + 1000, 10000, 15);
  bottomBound.restitution = 1;
  bottomBound.isStatic = true;
  bottomBound.mass = 400;
  World.add(engine.world, [topBound, bottomBound]);
  // run the engine
  Engine.run(engine);
}

function moveWithMainBody(mainBody) {
  cam.setPosition(mainBody.position.x, mainBody.position.y, 1000);
}

function draw() {
  moveWithMainBody(rocketBody);

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
  drawSprite(greyPlanet, greyPlanetImg);
  drawSprite(bluePlanet, bluePlanetImg);
  drawSprite(redPlanet, redPlanetImg);
  drawSprite(brownPlanet, brownPlanetImg);
  drawSprite(orangePlanet, orangePlanetImg);
  drawSprite(sun, sunImg);
  if (blackHole != null) {
    //drawSprite(blackHole, blackHoleImg);
  }
  drawSprite(ball[0], blackHoleImg);
  for (var i = 1; i < ball.length; i++) {
    drawBody(ball[i]);
  }
  circularOrbit();
  //orbitProperties.gravity += 0.000001;
  // vacuum
  if (topBound != null) {
    drawBody(topBound);
  }
  if (bottomBound != null) {
    drawBody(bottomBound);
  }
  if (rightBound != null) {
    drawBody(rightBound);
  }
  if (leftBound != null) {
    drawBody(leftBound);
  }
  drawSprite(rocketBody, rocketImg);

  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < plinkos.length; i++) {
    plinkos[i].show();
  }
  for (var i = 0; i < bounds.length; i++) {
    bounds[i].show();
  }
}
