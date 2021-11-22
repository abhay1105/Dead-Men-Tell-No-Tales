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
let space_screenTop;
let space_allObjects = [];
let space_mainBody;
let space_followingMainBody = true;
/* ----Planets------------------------------------------------------*/
let space_greyPlanet;
let space_greyPlanetImg;
let space_bluePlanet;
let space_bluePlanetImg;
let space_redPlanet;
let space_redPlanetImg;
let space_brownPlanet;
let space_brownPlanetImg;
let space_orangePlanet;
let space_orangePlanetImg;
/* ----Rocket-------------------------------------------------------*/
let space_rocketImg;
let space_rocketBody;
/* ----Sun----------------------------------------------------------*/
let space_sun;
let space_sunImg;
let space_explosionImg;
/* ----Gravity------------------------------------------------------*/
let space_gravityObjects = [];
let space_gameGravity = 0.001;
let space_lastTimeStamp = 0;
function gravity() {
  let length = space_gravityObjects.length;
  // compare two balls - because every object is attracted to another
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      // assuming they are not the same thing
      if (i != j) {
        let Dx =
          space_gravityObjects[j].position.x -
          space_gravityObjects[i].position.x;
        let Dy =
          space_gravityObjects[j].position.y -
          space_gravityObjects[i].position.y;
        let force =
          ((engine.timing.timestamp - space_lastTimeStamp) *
            space_gameGravity *
            space_gravityObjects[j].mass *
            space_gravityObjects[i].mass) /
          Math.sqrt(Dx * Dx + Dy * Dy);
        let angle = Math.atan2(Dy, Dx);
        space_gravityObjects[i].force.x += force * Math.cos(angle);
        space_gravityObjects[i].force.y += force * Math.sin(angle);
      }
    }
  }
  space_lastTimeStamp = engine.timing.timestamp;
}
/* ----Plinko-------------------------------------------------------*/
let space_particles = [];
let space_plinkos = [];
let space_bounds = [];

function space_newParticle(x, y) {
  let p = new Particle(x, y, 10);
  space_particles.push(p);
}
/* ----Circular Orbit-----------------------------------------------*/
let space_ball = [];
let space_circularOrbitObjects = [];
let space_orbitProperties = {
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
function space_preMadeBody(x, y, r, sides, Vx, Vy) {
  let i = space_ball.length;
  space_ball.push();
  space_ball[i] = Bodies.polygon(x, y, sides, r, {
    friction: space_orbitProperties.friction,
    frictionStatic: space_orbitProperties.frictionStatic,
    frictionAir: space_orbitProperties.frictionAir,
    restitution: space_orbitProperties.restitution,
  });
  Matter.Body.setVelocity(space_ball[i], {
    x: Vx,
    y: Vy,
  });
  World.add(engine.world, space_ball[i]);
  space_circularOrbitObjects.push(space_ball[i]);
}
function space_circularOrbit() {
  let length = space_circularOrbitObjects.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (i != j) {
        let Dx =
          space_circularOrbitObjects[j].position.x -
          space_circularOrbitObjects[i].position.x;
        let Dy =
          space_circularOrbitObjects[j].position.y -
          space_circularOrbitObjects[i].position.y;
        let force =
          ((engine.timing.timestamp - space_orbitProperties.lastTimeStamp) *
            space_orbitProperties.gravity *
            space_circularOrbitObjects[j].mass *
            space_circularOrbitObjects[i].mass) /
          Math.sqrt(Dx * Dx + Dy * Dy);
        let angle = Math.atan2(Dy, Dx);
        space_circularOrbitObjects[i].force.x += force * Math.cos(angle);
        space_circularOrbitObjects[i].force.y += force * Math.sin(angle);
      }
    }
  }
  space_orbitProperties.lastTimeStamp = engine.timing.timestamp;
}
/* ----Black Hole----------------------------------------------------*/
let space_blackHole;
let space_blackHoleImg;
/* ----Vacuum--------------------------------------------------------*/
let space_topBound;
let space_bottomBound;
let space_rightBound;
let space_leftBound;
/* ----Ending Sequence-----------------------------------------------*/
let space_blackHoleObjects = [];
let space_leftRect;
let space_rightRect;
let space_topRect;
let space_bottomRect;
let space_smallAsteroid;
let space_smallAsteroids = [];
let space_smallBrown;
let space_smallBrowns = [];
let space_smallBlue;
let space_smallBlues = [];
let space_smallRed;
let space_smallReds = [];
let space_smallOrange;
let space_smallOranges = [];

let space_endSlide;
let space_endSlideImg;
let space_showingEndingSequence = false;
/* ----Ragdoll-------------------------------------------------------*/
let space_ragdollCharacter;
let space_ragdolls = Composite.create();
function space_createRagdoll(x, y, scale, options) {
  scale = typeof scale === "undefined" ? 1 : scale;

  let Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Common = Matter.Common;

  let headOptions = Common.extend(
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

  let chestOptions = Common.extend(
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

  let leftArmOptions = Common.extend(
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

  let leftLowerArmOptions = Common.extend({}, leftArmOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  let rightArmOptions = Common.extend(
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

  let rightLowerArmOptions = Common.extend({}, rightArmOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  let leftLegOptions = Common.extend(
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

  let leftLowerLegOptions = Common.extend({}, leftLegOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  let rightLegOptions = Common.extend(
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

  let rightLowerLegOptions = Common.extend({}, rightLegOptions, {
    render: {
      fillStyle: "#FFFFFF",
    },
  });

  let head = Bodies.rectangle(
    x,
    y - 60 * scale,
    34 * scale,
    40 * scale,
    headOptions
  );
  let chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
  let rightUpperArm = Bodies.rectangle(
    x + 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    rightArmOptions
  );
  let rightLowerArm = Bodies.rectangle(
    x + 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    rightLowerArmOptions
  );
  let leftUpperArm = Bodies.rectangle(
    x - 39 * scale,
    y - 15 * scale,
    20 * scale,
    40 * scale,
    leftArmOptions
  );
  let leftLowerArm = Bodies.rectangle(
    x - 39 * scale,
    y + 25 * scale,
    20 * scale,
    60 * scale,
    leftLowerArmOptions
  );
  let leftUpperLeg = Bodies.rectangle(
    x - 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    leftLegOptions
  );
  let leftLowerLeg = Bodies.rectangle(
    x - 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    leftLowerLegOptions
  );
  let rightUpperLeg = Bodies.rectangle(
    x + 20 * scale,
    y + 57 * scale,
    20 * scale,
    40 * scale,
    rightLegOptions
  );
  let rightLowerLeg = Bodies.rectangle(
    x + 20 * scale,
    y + 97 * scale,
    20 * scale,
    60 * scale,
    rightLowerLegOptions
  );

  let chestToRightUpperArm = Constraint.create({
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

  let chestToLeftUpperArm = Constraint.create({
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

  let chestToLeftUpperLeg = Constraint.create({
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

  let chestToRightUpperLeg = Constraint.create({
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

  let upperToLowerRightArm = Constraint.create({
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

  let upperToLowerLeftArm = Constraint.create({
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

  let upperToLowerLeftLeg = Constraint.create({
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

  let upperToLowerRightLeg = Constraint.create({
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

  let headContraint = Constraint.create({
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

  let legToLeg = Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: rightLowerLeg,
    stiffness: 0.01,
    render: {
      visible: false,
    },
  });

  let person = Composite.create({
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
/* ----Conditions Class----------------------------------------------*/
let space_conditions = [];
class space_Conditions {
  constructor(checkFunction, notDoneFunction, onceDoneFunction) {
    this.check = checkFunction;
    this.notDone = notDoneFunction;
    this.onceDone = onceDoneFunction;
  }
}
/* ----Conditions----------------------------------------------------*/
// pass the first planet
space_conditions.push(
  new space_Conditions(
    () => {
      return space_rocketBody.position.x > space_greyPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_gravityObjects.push(
        space_rocketBody,
        space_greyPlanet,
        space_bluePlanet
      );
    }
  )
);
// pass the second planet
space_conditions.push(
  new space_Conditions(
    () => {
      return space_rocketBody.position.x > space_bluePlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_gravityObjects.push(
        space_rocketBody,
        space_bluePlanet,
        space_redPlanet
      );
    }
  )
);
// pass the third planet
space_conditions.push(
  new space_Conditions(
    () => {
      return space_rocketBody.position.x > space_redPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_gravityObjects.push(
        space_rocketBody,
        space_redPlanet,
        space_brownPlanet
      );
    }
  )
);
// pass the fourth planet
space_conditions.push(
  new space_Conditions(
    () => {
      return space_rocketBody.position.x > space_brownPlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_gravityObjects.push(
        space_rocketBody,
        space_brownPlanet,
        space_orangePlanet
      );
    }
  )
);
// pass the fifth planet
space_conditions.push(
  new space_Conditions(
    () => {
      return space_rocketBody.position.x > space_orangePlanet.position.x - 50;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_gravityObjects.push(
        space_rocketBody,
        space_orangePlanet,
        space_sun
      );
    }
  )
);
// collides with the sun
space_conditions.push(
  new space_Conditions(
    () => {
      return Matter.SAT.collides(space_rocketBody, space_sun).collided;
    },
    () => {
      Body.setVelocity(space_rocketBody, {
        x: 15,
        y: 0,
      });
      gravity();
    },
    () => {
      space_gravityObjects = [];
      space_rocketBody.mass = 0.07347;
      space_gravityObjects.push(space_rocketBody, space_blackHole);
    }
  )
);
// within striking distance of the black hole
space_conditions.push(
  new space_Conditions(
    () => {
      return (
        Math.abs(space_rocketBody.position.y - space_blackHole.position.y) < 500
      );
    },
    () => {
      gravity();
    },
    () => {
      space_orbitProperties.gravityAddition = 0.00001;
      space_gravityObjects = [];
      space_mainBody = space_blackHole;
      space_rocketBody = space_ball[1];
    }
  )
);
// if it actually collides with the black hole
space_conditions.push(
  new space_Conditions(
    () => {
      let xD = space_rocketBody.position.x - space_blackHole.position.x;
      let yD = space_rocketBody.position.y - space_blackHole.position.y;
      let tD = Math.sqrt(xD * xD + yD * yD);
      return tD < 100;
    },
    () => {
      // let xD = rocketBody.position.x - blackHole.position.x;
      // let yD = rocketBody.position.y - blackHole.position.y;
      // let tD = Math.sqrt(xD * xD + yD * yD);
      // console.log(tD);
    },
    () => {
      console.log("Collision");
      space_rocketBody.mass = 100;
      // rocketBody.isStatic = true;
      space_followingMainBody = false;
      space_gravityObjects.push(space_rocketBody);
    }
  )
);
// switches from the black hole craziness to the end sequence
space_conditions.push(
  new space_Conditions(
    () => {
      // when there is 100 balls collided
      return space_blackHoleObjects.length > 100;
    },
    () => {
      // randomly add balls to the screen and get them into the gravty component
      let leftX = space_rocketBody.position.x - screen.availWidth / 2;
      let topY = space_rocketBody.position.y - screen.availHeight / 2;
      let randomX = Math.random() * screen.availWidth + leftX;
      let randomY = Math.random() * screen.availHeight + topY;

      let random = Math.random();
      let b;
      if (random < 0.2) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        space_smallAsteroids.push(b);
      } else if (random < 0.4) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        space_smallReds.push(b);
      } else if (random < 0.6) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        space_smallOranges.push(b);
      } else if (random < 0.8) {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        space_smallBlues.push(b);
      } else {
        b = Bodies.circle(randomX, randomY, Math.random() * 50 + 10);
        space_smallBrowns.push(b);
      }
      World.add(engine.world, b);
      space_blackHoleObjects.push(b);
      space_gravityObjects.push(b);

      Body.setAngularVelocity(space_rocketBody, Math.PI / 6);
      // run the gravity function
      gravity();
    },
    () => {
      // explode all of the balls outward
      space_gravityObjects = [];
      blackHoleObject = [];
      space_smallAsteroids = [];
      space_smallBlues = [];
      space_smallBrowns = [];
      space_smallReds = [];
      space_smallOranges = [];
      space_blackHoleObjects.forEach((element) => {
        element.isStatic = true;
      });
      World.clear(engine.world);
      World.add(engine.world, [space_ragdolls]);
      space_showingEndingSequence = true;
      space_rocketBody.position.x = space_rocketBody.position.x - 50000;
      space_rocketBody.position.y = space_rocketBody.position.y - 50000;
    }
  )
);
/* ----Draw and Setup -----------------------------------------------*/
function preload() {
  space_smallAsteroid = loadImage("small-asteroid.png");
  space_smallOrange = loadImage("orange-planet-small.png");
  space_smallBrown = loadImage("small-brown-planet.png");
  space_smallBlue = loadImage("blue-planet-small.png");
  space_smallRed = loadImage("small-red-planet.png");
  space_endSlideImg = loadImage("end slide.png");
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

  space_rocketBody = Bodies.rectangle(350, 0, 150, 60);
  space_rocketBody.mass = 9;
  space_rocketImg = loadImage("rocket-ship-image.png");
  space_mainBody = space_rocketBody;

  World.add(engine.world, space_rocketBody);

  space_orangePlanetImg = loadImage("greyPlanet.png");

  space_greyPlanetImg = loadImage("greyPlanet.png");
  space_greyPlanet = Bodies.circle(1700, 750, 150);
  space_greyPlanet.mass = 250;
  space_greyPlanet.isStatic = true;

  space_bluePlanetImg = loadImage("bluePlanet.png");
  space_bluePlanet = Bodies.circle(3200, -550, 256);
  space_bluePlanet.mass = 500;
  space_bluePlanet.isStatic = true;

  space_redPlanetImg = loadImage("redPlanet.png");
  space_redPlanet = Bodies.circle(5700, 750, 256);
  space_redPlanet.mass = 750;
  space_redPlanet.isStatic = true;

  space_brownPlanetImg = loadImage("brownPlanet.png");
  space_brownPlanet = Bodies.circle(9300, -550, 300);
  space_brownPlanet.mass = 1000;
  space_brownPlanet.isStatic = true;

  space_orangePlanetImg = loadImage("orangePlanet.png");
  space_orangePlanet = Bodies.circle(13800, 750, 400);
  space_orangePlanet.mass = 1250;
  space_orangePlanet.isStatic = true;
  // add all of the bodies to the world
  World.add(engine.world, [
    space_greyPlanet,
    space_bluePlanet,
    space_redPlanet,
    space_brownPlanet,
    space_orangePlanet,
  ]);
  space_allObjects.push(
    space_greyPlanet,
    space_bluePlanet,
    space_redPlanet,
    space_brownPlanet,
    space_orangePlanet
  );

  // sun
  space_sun = Bodies.circle(20000, 1500, 709);
  space_sunImg = loadImage("sun.png");
  space_sun.isStatic = true;
  space_sun.restitution = 1;
  World.add(engine.world, space_sun);
  space_allObjects.push(space_sun);

  space_gravityObjects.push(space_rocketBody);
  space_gravityObjects.push(space_greyPlanet);
  // plinko
  world = engine.world;

  // randomly adds plinko to the screen (asteroids)
  for (let x = 0; x < 100; x += 1) {
    xVal = Math.floor(Math.random() * 6000) + 15000;
    yVal = -Math.floor(Math.random() * 1000) - 1000;
    plinko = new Plinko(xVal, yVal, Math.random() * 40 + 10, 127, engine.world);
    space_plinkos.push(plinko);
    space_allObjects.push(plinko);
  }

  //  black hole
  let blackHoleX = 16500 + 1500;
  let blackHoleY = -7500;
  space_blackHole = Bodies.circle(blackHoleX, blackHoleY, 200);
  space_blackHole.mass = 500;
  space_blackHole.restitution = 0;
  space_blackHole.isStatic = true;
  space_blackHoleImg = loadImage("blackHole.png");
  //World.add(engine.world, blackHole);

  space_ball = [];
  space_preMadeBody(blackHoleX, blackHoleY, 50, 0, 0, 0);
  space_preMadeBody(blackHoleX - 300, blackHoleY, 5, 0, 0, 6);
  space_preMadeBody(blackHoleX, blackHoleY + 250, 5, 0, 6, 0);
  space_preMadeBody(blackHoleX + 200, blackHoleY, 5, 0, 0, -6);
  space_preMadeBody(blackHoleX, blackHoleY - 300, 5, 0, -6, 0);
  // vacuum
  space_topBound = Bodies.rectangle(
    16500 + 1500 + 10000,
    -2250 - 1000,
    10000,
    15
  );
  space_topBound.restitution = 1;
  space_topBound.isStatic = true;
  space_bottomBound = Bodies.rectangle(
    16500 + 1500 + 10000,
    -2250 + 1000,
    10000,
    15
  );
  space_bottomBound.restitution = 1;
  space_bottomBound.isStatic = true;
  space_bottomBound.mass = 400;
  World.add(engine.world, [space_topBound, space_bottomBound]);

  //ending sequence
  for (let i = 0; i < 1; i += 1) {
    space_ragdollCharacter = space_createRagdoll(
      blackHoleX - screen.availWidth / 2 - 75,
      blackHoleY,
      1.3
    );
    Composite.add(space_ragdolls, space_ragdollCharacter);
  }

  space_endSlide = Bodies.rectangle(blackHoleX + 350, blackHoleY, 960, 720);

  // create the bounds
  let leftX = blackHoleX - screen.availWidth / 2;
  let rightX = blackHoleX + screen.availWidth / 2;
  let topY = blackHoleY - screen.availHeight / 2;
  let bottomY = blackHoleY + screen.availHeight / 2;

  space_topRect = Bodies.rectangle(
    (leftX + rightX) / 2,
    topY,
    screen.availWidth,
    50
  );
  space_topRect.isStatic = true;
  space_bottomRect = Bodies.rectangle(
    (leftX + rightX) / 2,
    bottomY,
    screen.availWidth,
    50
  );
  space_bottomRect.isStatic = true;
  space_leftRect = Bodies.rectangle(
    leftX,
    (topY + bottomY) / 2,
    50,
    screen.availHeight
  );
  space_leftRect.isStatic = true;
  space_rightRect = Bodies.rectangle(
    rightX,
    (topY + bottomY) / 2,
    50,
    screen.availHeight
  );
  space_rightRect.isStatic = true;
  World.add(engine.world, [
    space_topRect,
    space_bottomRect,
    space_leftRect,
    space_rightRect,
  ]);
  // run the engine
  Engine.run(engine);
}

function moveWithMainBody(mainBody) {
  cam.setPosition(mainBody.position.x, mainBody.position.y, 1000);
}

function draw() {
  if (space_followingMainBody) {
    moveWithMainBody(space_mainBody);
  }

  if (space_conditions.length > 0) {
    if (space_conditions[0].check()) {
      space_conditions[0].onceDone();
      space_conditions.shift();
    } else {
      space_conditions[0].notDone();
    }
  }

  background(0);
  fill(128);
  drawSprite(space_greyPlanet, space_greyPlanetImg);
  drawSprite(space_bluePlanet, space_bluePlanetImg);
  drawSprite(space_redPlanet, space_redPlanetImg);
  drawSprite(space_brownPlanet, space_brownPlanetImg);
  drawSprite(space_orangePlanet, space_orangePlanetImg);
  drawSprite(space_sun, space_sunImg);

  drawSprite(space_rocketBody, space_rocketImg);

  space_ball[0].isStatic = true;
  drawSprite(space_ball[0], space_blackHoleImg);
  for (let i = 1; i < space_ball.length; i++) {
    drawBody(space_ball[i]);
  }
  space_circularOrbit();
  space_orbitProperties.gravity += space_orbitProperties.gravityAddition;
  // vacuum
  if (space_topBound != null) {
    drawBody(space_topBound);
  }
  if (space_bottomBound != null) {
    drawBody(space_bottomBound);
  }
  if (space_rightBound != null) {
    drawBody(space_rightBound);
  }
  if (space_leftBound != null) {
    drawBody(space_leftBound);
  }

  for (let i = 0; i < space_particles.length; i++) {
    space_particles[i].show();
    if (space_particles[i].isOffScreen()) {
      World.remove(world, space_particles[i].body);
      space_particles.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < space_plinkos.length; i++) {
    space_plinkos[i].show();
  }
  for (let i = 0; i < space_bounds.length; i++) {
    space_bounds[i].show();
  }

  space_smallAsteroids.forEach((element) => {
    drawSprite(element, space_smallAsteroid);
  });
  space_smallBlues.forEach((element) => {
    drawSprite(element, space_smallBlue);
  });
  space_smallBrowns.forEach((element) => {
    drawSprite(element, space_smallBrown);
  });
  space_smallReds.forEach((element) => {
    drawSprite(element, space_smallRed);
  });
  space_smallOranges.forEach((element) => {
    drawSprite(element, space_smallOrange);
  });

  if (space_showingEndingSequence) {
    Body.setAngularVelocity(space_ragdollCharacter.bodies[0], Math.PI / 125);
    Body.setVelocity(space_ragdollCharacter.bodies[0], { x: 0.9, y: 0 });
    fill(255, 255, 255);
    drawBodies(space_ragdollCharacter.bodies);
    drawSprite(space_endSlide, space_endSlideImg);
  }
}
