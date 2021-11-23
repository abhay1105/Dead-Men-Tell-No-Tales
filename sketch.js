////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let engine, world, canvas;
let currentStage = "ice";

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Runner = Matter.Runner;
const Events = Matter.Events;

const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const drawMouse = Helpers.drawMouse;
const drawConstraint = Helpers.drawConstraint;
const drawSprite = Helpers.drawSprite;

function preload() {

  // global environment setup
  engine = Engine.create();
  world = engine.world;

  // resource loading

  // ice
  ice_font = loadFont("./resources/outfit.ttf");

  // space
  space_smallAsteroid = loadImage("./resources/small-asteroid.png");
  space_smallOrange = loadImage("./resources/orange-planet-small.png");
  space_smallBrown = loadImage("./resources/small-brown-planet.png");
  space_smallBlue = loadImage("./resources/blue-planet-small.png");
  space_smallRed = loadImage("./resources/small-red-planet.png");
  space_endSlideImg = loadImage("./resources/end slide.png");
  space_bg = loadImage("./resources/space-background.jpg");

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// VARIABLES, FUNCTIONS, CLASSES


// AIR








// RAINFOREST







// ICE


// BEGINNING OF ICE VARIABLE INITIALIZATION

// ice environment
let ice_x = 0;
let ice_y = 0;

// camera settings
let iceCamera;

// current position
let iceCameraX = 0;
let iceCameraY = 0;
let iceCameraZ = 0;

// amount to move each frame
let iceCameraChangeX = 0;
let iceCameraChangeY = 0;
let iceCameraChangeZ = 0;

// coordinate we need to reach
let iceCameraTargetX = 0;
let iceCameraTargetY = 0;
let iceCameraTargetZ = 0;

// extra settings
let iceCameraMoving = false;
let iceCameraPanningSpeed = 5;
let useIceCameraPanning = true;
let iceFramesPerSecond = 30;
let iceCameraDebugging = false;

// sound settings
let iceSoundPlaying = false;
let iceVolume = 0.1;
let iceOnClicked = false;
let ice_audio;
let ice_first_time_audio = true;
let ice_audio_setup_completed = false;

// font settings
let ice_font;

let ice_mic;
let ice_fft;
let ice_skyLayer;
let ice_spectrumX = 0;
let ice_spectrumY = 0;
let ice_spectrumSpeed = 2;

// ice bodies and booleans/arrays
let ice_all_bodies;
let ice_starting_rectangle;
let second_ice_starting_rectangle;
let ice_starting_raised_rectangle;
let ice_starting_dominoes = [];
let ice_starting_flag;
let second_ice_flag;
let third_ice_flag;
let fourth_ice_flag;
let fifth_ice_flag;
let ice_starting_flag_checkpoint = false;
let second_ice_flag_checkpoint = false;
let third_ice_flag_checkpoint = false;
let fourth_ice_flag_checkpoint = false;
let fifth_ice_flag_checkpoint = false;
let ice_curve;
let ice_main_body;
let ice_plinko_pegs = [];
let ice_landing_rectangle;
let ice_plinko_ball_cover;
let ice_plinko_ball_left_wall;
let ice_plinko_ball_right_wall;
let ice_plinko_ball_door;
let ice_plinko_balls = [];
let ice_plinko_left_boundary;
let ice_plinko_right_boundary;
let ice_spin_left_vertical;
let ice_spin_left_horizontal;
let ice_spin_right_vertical;
let ice_spin_right_horizontal;
let ice_slant_one;
let ice_slant_two;
let ice_slant_three;
let ice_slant_four;
let ice_basket_left_wall;
let ice_basket_right_wall;
let ice_basket_bottom;
let ice_lever;
let ice_lever_constraint;
let ice_chain;
let ice_chain_top_constraint;
let ice_chain_bottom_constraint;
let ice_lever_weight;
let ice_basket_left_constraint;
let ice_basket_right_constraint;
let ice_basket_constraint;
let ice_wind_generator;
let ice_final_ramp;
let ice_launching_flat;
let ice_launching_station;
let ice_fuel_gauge = 0;

// ice images and gifs
let ice_flag_image;
let ice_bg_gif;
let ice_bg_img;

// ice conditions array
var ice_conditions = [];

// END OF ICE VARIABLE INITIALIZATION

// BEGINNING OF ICE FUNCTIONS & CLASSES

class IceCondition {
  constructor(checkFunction, onceDoneFunction) {
    this.check = checkFunction;
    this.onceDone = onceDoneFunction;
  }
}

// function preload() {
//     ice_bg_img = loadImage("wano.jpeg");
//     ice_font = loadFont("outfit.ttf");
// }

function iceRandomNumber(lowerBound, upperBound) {
  return Math.floor((Math.random() * upperBound) + lowerBound);
}

function iceCreatePegs(x, y, rows, columns, spacing, radius) {
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

function iceCreateDominoes(x, y, width, height, dominoCount, spacing) {
  var dominoes = [];
  for (var i = 0; i < dominoCount; i++) {
    var rgb = "rgb(" + iceRandomNumber(1, 255) + "," + iceRandomNumber(1, 255) + "," + iceRandomNumber(1, 255) + ")";
    dominoes.push(new IceDomino(x, y - height * 0.5, width, height, rgb));
    x += spacing + 0.5 * width;
  }
  return dominoes;
}

function iceCreatePlinkoBalls(numberOfBalls, sourceX, sourceY) {
  var particles = [];
  for (var i = 0; i < numberOfBalls; i++) {
    var rgb = "rgb(" + iceRandomNumber(1, 255) + "," + iceRandomNumber(1, 255) + "," + iceRandomNumber(1, 255) + ")";
    particles.push(new IceParticlePlinko(sourceX, sourceY, iceRandomNumber(10, 30), rgb));
  }
  return particles;
}

function iceSpinPinwheels(pinwheelObjects) {
  for (var i = 0; i < pinwheelObjects.length; i++) {
    if (i < 2) {
      Body.setAngle(pinwheelObjects[i], pinwheelObjects[i].angle + pinwheelObjects[i].rotationSpeed);
    } else {
      Body.setAngle(pinwheelObjects[i], pinwheelObjects[i].angle - pinwheelObjects[i].rotationSpeed);
    }
  }
}

function ICE_MOVE_CAMERA(changeX, changeY, changeZ, durationInSeconds) {
  if (!iceCameraDebugging) {
    if (useIceCameraPanning) {
      iceMoveCameraPan(changeX, changeY, changeZ, durationInSeconds, iceFramesPerSecond);
    } else {
      iceMoveCamera(changeX, changeY, changeZ);
    }
  }
}

function iceMoveCameraPan(changeX, changeY, changeZ, durationInSeconds, currentFrameCount) {
  iceCameraMoving = true;
  var totalFrames = durationInSeconds * currentFrameCount;
  iceCameraChangeX = changeX / totalFrames;
  iceCameraChangeY = changeY / totalFrames;
  iceCameraChangeZ = changeZ / totalFrames;
  iceCameraTargetX = iceCameraX + changeX;
  iceCameraTargetY = iceCameraY + changeY;
  iceCameraTargetZ = iceCameraZ + changeZ;
}

function iceMoveCamera(changeX, changeY, changeZ) {
  iceCameraX += changeX;
  iceCameraY += changeY;
  iceCameraZ += changeZ;
  iceCamera.move(changeX, changeY, changeZ);
}

document.documentElement.addEventListener(
  "mousedown", function () {
    iceOnClicked = true;
  }
);

// END OF ICE FUNCTIONS & CLASSES




// SPACE


let space_screenTop;
let space_allObjects = [];
let space_mainBody;
let space_followingMainBody = true;
let space_startingX = ice_x;
let space_startingY = ice_y + 14085;
// let space_startingX = ice_x;
// let space_startingY = ice_y;
let space_bg;
function space_moveWithMainBody(mainBody) {
  cam.setPosition(mainBody.position.x, mainBody.position.y, 5000);
}
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



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SETUP FUNCTIONS


// AIR




// RAINFOREST





// ICE

function iceSetup() {

  iceCamera = createCamera();
  // technically need to get current instance of camera from previous environment
  // starting camera spot for ice environment
  iceMoveCamera(ice_x + 400, ice_y + 500, 0);
  // moveCamera(ice_x + 15000, ice_y + 15000, 6000);
  iceCameraX = iceCamera.centerX;
  iceCameraY = iceCamera.centerY;
  iceCameraZ = iceCamera.centerZ;

  // BEGINNING OF ICE SETUP CODE

  // creating all of the ice bodies
  ice_starting_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 420, 660, 60, { isStatic: true });
  second_ice_starting_rectangle = Bodies.rectangle(ice_x + 1160, ice_y + 420, 1000, 60, { isStatic: true });
  ice_starting_raised_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 370, 660, 40, { isStatic: true });
  ice_starting_dominoes = iceCreateDominoes(ice_x + 685, ice_y + 340, 20, 100, 17, 15);
  ice_main_body = Bodies.circle(ice_x + 100, ice_y + 300, 40, { density: 0.11 });
  ice_starting_flag = Bodies.rectangle(ice_x + 1260, ice_y + 360, 60, 60, { isStatic: true });
  ice_curve_vertices = [
    { x: 0, y: 0 },
    { x: 60, y: 250 },
    { x: 120, y: 480 },
    { x: 180, y: 690 },
    { x: 240, y: 880 },
    { x: 300, y: 1050 },
    { x: 360, y: 1200 },
    { x: 420, y: 1330 },
    { x: 480, y: 1440 },
    { x: 540, y: 1520 },
    { x: 570, y: 1550 },
    { x: 600, y: 1560 },
    { x: 640, y: 1550 },
    { x: 680, y: 1540 },
    { x: 760, y: 1500 },
    { x: 760, y: 2000 },
    { x: -660, y: 2000 },
    { x: -660, y: 0 }
  ];
  ice_curve = Bodies.fromVertices(ice_x + 860, ice_y + 1635, ice_curve_vertices, { isStatic: true, friction: 0, restitution: 1 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);
  second_ice_flag = Bodies.rectangle(ice_x + 1465, ice_y + 1985, 60, 60, { isStatic: true });
  ice_plinko_pegs = iceCreatePegs(ice_x + 1600, ice_y + 2050, 15, 13, 100, 30);
  ice_landing_rectangle = Bodies.rectangle(ice_x + 4300, ice_y + 2080, 1000, 120, { isStatic: true });
  third_ice_flag = Bodies.rectangle(ice_x + 4350, ice_y + 2050, 60, 60, { isStatic: true });
  ice_plinko_ball_cover = Bodies.rectangle(ice_x + 2570, ice_y - 290, 1360, 20, { isStatic: true });
  ice_plinko_ball_left_wall = Bodies.rectangle(ice_x + 1900, ice_y + 200, 20, 1000, { isStatic: true });
  ice_plinko_ball_right_wall = Bodies.rectangle(ice_x + 3240, ice_y + 200, 20, 1000, { isStatic: true });
  ice_plinko_ball_door = Bodies.rectangle(ice_x + 2570, ice_y + 690, 1360, 20, { isStatic: true });
  ice_plinko_balls = iceCreatePlinkoBalls(200, ice_x + 2570, ice_y + 200);
  ice_plinko_left_boundary = Bodies.rectangle(ice_x + 1350, ice_y + 4000, 20, 3800, { isStatic: true });
  ice_plinko_right_boundary = Bodies.rectangle(ice_x + 3875, ice_y + 4000, 20, 3800, { isStatic: true });
  Body.rotate(ice_plinko_left_boundary, 3);
  Body.rotate(ice_plinko_right_boundary, -3);
  ice_slant_one = Bodies.rectangle(ice_x + 1870, ice_y + 6200, 2900, 40, { isStatic: true, friction: 0 });
  ice_slant_two = Bodies.rectangle(ice_x + 3270, ice_y + 6800, 2900, 40, { isStatic: true, friction: 0 });
  ice_slant_three = Bodies.rectangle(ice_x + 1870, ice_y + 7400, 2900, 40, { isStatic: true, friction: 0 });
  ice_slant_four = Bodies.rectangle(ice_x + 3270, ice_y + 8000, 2900, 40, { isStatic: true, friction: 0 });
  Body.rotate(ice_slant_one, -3);
  Body.rotate(ice_slant_two, 3);
  Body.rotate(ice_slant_three, -3);
  Body.rotate(ice_slant_four, 3);
  ice_spin_left_vertical = Bodies.rectangle(ice_x + 2150, ice_y + 4950, 40, 800, { isStatic: true, inertia: Infinity, rotationSpeed: 0.02, restitution: 0.8 });
  ice_spin_left_horizontal = Bodies.rectangle(ice_x + 2150, ice_y + 4950, 800, 40, { isStatic: true, inertia: Infinity, rotationSpeed: 0.02, restitution: 0.8 });
  ice_spin_right_vertical = Bodies.rectangle(ice_x + 3000, ice_y + 5400, 40, 800, { isStatic: true, inertia: Infinity, rotationSpeed: 0.02, restitution: 0.8 });
  ice_spin_right_horizontal = Bodies.rectangle(ice_x + 3000, ice_y + 5400, 800, 40, { isStatic: true, inertia: Infinity, rotationSpeed: 0.02, restitution: 0.8 });
  ice_basket_left_wall = Bodies.rectangle(ice_x + 1000, ice_y + 9000, 40, 600, { isStatic: true });
  ice_basket_right_wall = Bodies.rectangle(ice_x + 1840, ice_y + 9000, 40, 600, { isStatic: true });
  ice_basket_bottom = Bodies.rectangle(ice_x + 1420, ice_y + 9280, 800, 40, { isStatic: true });
  ice_lever = Bodies.rectangle(ice_x + 3280, ice_y + 9320, 4600, 40);
  ice_chain = Bodies.rectangle(ice_x + 5920, ice_y + 9780, 120, 1400);
  ice_lever_weight = Bodies.circle(ice_x + 5920, ice_y + 10500, 300);
  ice_chain_top_constraint = Constraint.create({
    bodyA: ice_lever,
    bodyB: ice_chain,
    pointA: {
      x: 2000,
      y: 0
    },
    pointB: {
      x: 0,
      y: -600
    },
    length: 400,
    stiffness: 0.4
  });
  ice_chain_bottom_constraint = Constraint.create({
    bodyA: ice_chain,
    bodyB: ice_lever_weight,
    pointA: {
      x: 0,
      y: 600
    },
    length: 600,
    stiffness: 0.4
  });
  ice_lever_constraint = Constraint.create({
    pointA: {
      x: ice_lever.position.x,
      y: ice_lever.position.y
    },
    bodyB: ice_lever,
    length: 0,
    stiffness: 0.9
  });
  fourth_ice_flag = Bodies.rectangle(ice_x + 1000, ice_y + 8900, 40, 40, { isStatic: true });
  fifth_ice_flag = Bodies.rectangle(ice_x + 4820, ice_y + 8400, 400, 400, { isStatic: true });
  ice_wind_generator = Bodies.rectangle(ice_x - 500, ice_y + 11900, 800, 800, { isStatic: true });
  ice_final_ramp = Bodies.rectangle(ice_x + 7500, ice_y + 16000, 15000, 40, { isStatic: true, friction: 0, restitution: 1, frictionAir: 0 });
  Body.rotate(ice_final_ramp, -3.05);
  ice_launching_flat = Bodies.rectangle(ice_x + 17450, ice_y + 16685, 5000, 40, { isStatic: true, friction: 0, restitution: 1, frictionAir: 0 });
  ice_launching_station = Bodies.rectangle(ice_x + 15300, ice_y + 15785, 800, 1800, { isStatic: true });

  // adding all bodies into one array and adding them into the world
  ice_all_bodies = [ice_starting_rectangle, second_ice_starting_rectangle, ice_main_body, ice_starting_raised_rectangle, ice_starting_flag, ice_curve, second_ice_flag, ice_plinko_pegs, ice_landing_rectangle,
    third_ice_flag, ice_plinko_ball_cover, ice_plinko_ball_left_wall, ice_plinko_ball_right_wall, ice_plinko_ball_door, ice_plinko_left_boundary, ice_plinko_right_boundary, ice_slant_one, ice_slant_two,
    ice_slant_three, ice_slant_four, ice_spin_left_vertical, ice_spin_left_horizontal, ice_spin_right_vertical, ice_spin_right_horizontal, ice_basket_left_wall, ice_basket_right_wall, ice_basket_bottom,
    ice_lever, ice_chain, ice_lever_weight, ice_chain_top_constraint, ice_chain_bottom_constraint, ice_lever_constraint, fourth_ice_flag, fifth_ice_flag, ice_wind_generator, ice_final_ramp, ice_launching_flat,
    ice_launching_station];
  for (var i = 0; i < ice_starting_dominoes.length; i++) {
    ice_all_bodies.push(ice_starting_dominoes[i]);
  }
  for (var j = 0; j < ice_plinko_balls.length; j++) {
    ice_all_bodies.push(ice_plinko_balls[j]);
  }
  World.add(world, ice_all_bodies);

  // END OF ICE SETUP CODE

}


// SPACE

function spaceSetup() {

  // xx, yy, sides, radius?

  space_rocketBody = Bodies.rectangle(
    space_startingX + 350,
    space_startingY + 0,
    150,
    60
  );
  space_rocketBody.mass = 9;
  space_rocketImg = loadImage("./resources/rocket-ship-image.png");
  space_mainBody = space_rocketBody;

  World.add(engine.world, space_rocketBody);

  space_orangePlanetImg = loadImage("./resources/greyPlanet.png");

  space_greyPlanetImg = loadImage("./resources/greyPlanet.png");
  space_greyPlanet = Bodies.circle(
    space_startingX + 1700,
    space_startingY + 750,
    150
  );
  space_greyPlanet.mass = 250;
  space_greyPlanet.isStatic = true;

  space_bluePlanetImg = loadImage("./resources/bluePlanet.png");
  space_bluePlanet = Bodies.circle(
    space_startingX + 3200,
    space_startingY - 550,
    256
  );
  space_bluePlanet.mass = 500;
  space_bluePlanet.isStatic = true;

  space_redPlanetImg = loadImage("./resources/redPlanet.png");
  space_redPlanet = Bodies.circle(
    space_startingX + 5700,
    space_startingY + 750,
    256
  );
  space_redPlanet.mass = 750;
  space_redPlanet.isStatic = true;

  space_brownPlanetImg = loadImage("./resources/brownPlanet.png");
  space_brownPlanet = Bodies.circle(
    space_startingX + 9300,
    space_startingY - 550,
    300
  );
  space_brownPlanet.mass = 1000;
  space_brownPlanet.isStatic = true;

  space_orangePlanetImg = loadImage("./resources/orangePlanet.png");
  space_orangePlanet = Bodies.circle(
    space_startingX + 13800,
    space_startingY + 750,
    400
  );
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
  space_sun = Bodies.circle(
    space_startingX + 20000,
    space_startingY + 1500,
    709
  );
  space_sunImg = loadImage("./resources/sun.png");
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
    xVal = Math.floor(Math.random() * 6000) + 15000 + space_startingX;
    yVal = -Math.floor(Math.random() * 1000) - 1000 + space_startingY;
    plinko = new Plinko(xVal, yVal, Math.random() * 40 + 10, 127, engine.world);
    space_plinkos.push(plinko);
    space_allObjects.push(plinko);
  }

  //  black hole
  let blackHoleX = 16500 + 1500 + space_startingX;
  let blackHoleY = -7500 + space_startingY;
  space_blackHole = Bodies.circle(blackHoleX, blackHoleY, 200);
  space_blackHole.mass = 500;
  space_blackHole.restitution = 0;
  space_blackHole.isStatic = true;
  space_blackHoleImg = loadImage("./resources/blackHole.png");
  //World.add(engine.world, blackHole);

  space_ball = [];
  space_preMadeBody(blackHoleX, blackHoleY, 50, 0, 0, 0);
  space_preMadeBody(blackHoleX - 300, blackHoleY, 5, 0, 0, 6);
  space_preMadeBody(blackHoleX, blackHoleY + 250, 5, 0, 6, 0);
  space_preMadeBody(blackHoleX + 200, blackHoleY, 5, 0, 0, -6);
  space_preMadeBody(blackHoleX, blackHoleY - 300, 5, 0, -6, 0);
  // vacuum
  space_topBound = Bodies.rectangle(
    16500 + 1500 + 10000 + space_startingX,
    -2250 - 1000 + space_startingY,
    10000,
    15
  );
  space_topBound.restitution = 1;
  space_topBound.isStatic = true;
  space_bottomBound = Bodies.rectangle(
    16500 + 1500 + 10000 + space_startingX,
    -2250 + 1000 + space_startingY,
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

  space_endSlide = Bodies.rectangle(blackHoleX, blackHoleY, 960, 720);

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
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CONDITIONS CODE

// AIR





// RAINFOREST





// ICE

// BEGINNING OF ICE CONDITIONS CODE

var iceFirstTime = true;

ice_conditions.push(
  new IceCondition(
    () => {
      return Matter.SAT.collides(ice_starting_dominoes[ice_starting_dominoes.length - 1].body, ice_starting_flag).collided;
    },
    () => {
      ice_starting_flag_checkpoint = true;
      Matter.Body.setPosition(second_ice_starting_rectangle, { x: ice_x + 1250, y: ice_y + 420 });
      ICE_MOVE_CAMERA(4200, 1600, 6500, iceCameraPanningSpeed);
    }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      return Matter.SAT.collides(ice_main_body, second_ice_flag).collided;
    },
    () => {
      second_ice_flag_checkpoint = true;
      Body.applyForce(ice_main_body, { x: ice_main_body.position.x, y: ice_main_body.position.y }, { x: 60, y: -60 });
      ICE_MOVE_CAMERA(0, 2700, 500, iceCameraPanningSpeed);
    }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      return Matter.SAT.collides(ice_main_body, third_ice_flag).collided;
    },
    () => {
      third_ice_flag_checkpoint = true;
      World.remove(world, ice_plinko_ball_door);
      ICE_MOVE_CAMERA(0, 20000, 500, iceCameraPanningSpeed * 65);
    }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      var somethingCollided = false;
      for (var i = 0; i < ice_plinko_balls.length; i++) {
        if (Matter.SAT.collides(ice_plinko_balls[i].body, fourth_ice_flag).collided) {
          somethingCollided = true;
        }
      }
      return somethingCollided;
    },
    () => {
      fourth_ice_flag_checkpoint = true;
      World.remove(world, ice_basket_bottom);
    }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      return Matter.SAT.collides(ice_lever, fifth_ice_flag).collided;
    },
    () => {
      fifth_ice_flag_checkpoint = true;
      ICE_MOVE_CAMERA(23000, 13000, 3000, iceCameraPanningSpeed * 10);
    }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      for (var i = 0; i < ice_plinko_balls.length; i++) {
        var position = ice_plinko_balls[i].body.position;
        if (position.x > ice_x - 500 && position.y > 11500 && position.y < 12300) {
          Body.applyForce(ice_plinko_balls[i].body, { x: position.x, y: position.y }, { x: 0.1, y: 0 })
        }
      }
      return false;
    },
    () => { }
  )
);

ice_conditions.push(
  new IceCondition(
    () => {
      for (var i = 0; i < ice_plinko_balls.length; i++) {
        if (Matter.SAT.collides(ice_launching_station, ice_plinko_balls[i].body).collided && ice_plinko_balls[i].body.position.y >= ice_y + 15735) {
          World.remove(world, ice_plinko_balls[i].body);
          if (ice_fuel_gauge < 1800) {
            ice_fuel_gauge += 450; // 20
          }
          ice_plinko_balls.splice(i, 1);
        }
      }
      return false;
    },
    () => { }
  )
);

// condition to start the space stage
ice_conditions.push(
  new IceCondition(
    () => {
      return ice_fuel_gauge >= 1800;
    },
    () => {
      currentStage = "space";
      cam = iceCamera;
      engine.world.gravity.y = 0;
      // World.remove(world, ice_all_bodies);
      // World.clear(world);
      // Engine.clear(engine);
      // spaceSetup();
    }
  )
);



// END OF ICE CONDITIONS CODE




// SPACE

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
      ball = [];
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
      space_blackHoleImg = null;
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







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DRAW FUNCTIONS


// AIR




// RAINFOREST




// ICE

function iceDraw() {

  // BEGINNING OF ICE BIOME DRAW CODE

  // audio setup
  if (iceOnClicked && !iceSoundPlaying) {
    ice_audio = document.getElementById("jjkAudio");
    ice_audio.volume = iceVolume;
    let playPromise = ice_audio.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        iceSoundPlaying = true;
        ice_audio.onended = function () {
          iceSoundPlaying = false;
        }
      }).catch(error => {
        console.log(error)
      });
    }
  }

  if (iceSoundPlaying && ice_first_time_audio) {
    ice_first_time_audio = false;

    ice_fft = new p5.FFT();
    ice_fft.setInput(ice_audio);

    ice_audio_setup_completed = true;
  }

  // code to pan camera with desired vectors
  if (iceCameraMoving) {
    iceCameraX += iceCameraChangeX;
    iceCameraY += iceCameraChangeY;
    iceCameraZ += iceCameraChangeZ;
    iceMoveCamera(iceCameraChangeX, iceCameraChangeY, iceCameraChangeZ);
    var currentCoordinates = [iceCameraX, iceCameraY, iceCameraZ];
    var coordinateChange = [iceCameraChangeX, iceCameraChangeY, iceCameraChangeZ];
    var targetCoordinates = [iceCameraTargetX, iceCameraTargetY, iceCameraTargetZ];
    var coordinatesAchieved = [false, false, false];
    for (var i = 0; i < currentCoordinates.length; i++) {
      if (coordinateChange[i] >= 0) {
        if (currentCoordinates[i] >= targetCoordinates[i]) {
          coordinatesAchieved[i] = true;
        }
      } else {
        if (currentCoordinates[i] <= targetCoordinates[i]) {
          coordinatesAchieved[i] = true;
        }
      }
    }
    if (coordinatesAchieved[0] && coordinatesAchieved[1] && coordinatesAchieved[2]) {
      iceCameraMoving = false;
    }
  }

  // checking certain conditions before drawing process begins
  if (ice_conditions.length > 0) {
    for (var i = ice_conditions.length - 1; i >= 0; i--) {
      condition = ice_conditions[i];
      if (condition.check()) {
        condition.onceDone();
        ice_conditions.splice(i, 1);
      }
    }
  }

  // initial drawing
  background(0);
  // clear();
  fill(255);
  stroke(255);

  // constant movement
  var pinwheelObjects = [ice_spin_left_vertical, ice_spin_left_horizontal, ice_spin_right_vertical, ice_spin_right_horizontal];
  iceSpinPinwheels(pinwheelObjects);

  // drawing most of our static bodies
  drawBody(ice_starting_rectangle);
  drawBody(ice_starting_raised_rectangle);
  drawBody(second_ice_starting_rectangle);
  drawBody(ice_curve);
  drawBody(ice_landing_rectangle);
  drawBody(ice_plinko_ball_cover);
  drawBody(ice_plinko_ball_left_wall);
  drawBody(ice_plinko_ball_right_wall);
  drawBody(ice_plinko_left_boundary);
  drawBody(ice_plinko_right_boundary);
  drawBody(ice_slant_one);
  drawBody(ice_slant_two);
  drawBody(ice_slant_three);
  drawBody(ice_slant_four);
  drawBody(ice_spin_left_vertical);
  drawBody(ice_spin_left_horizontal);
  drawBody(ice_spin_right_vertical);
  drawBody(ice_spin_right_horizontal);
  drawBody(ice_basket_left_wall);
  drawBody(ice_basket_right_wall);
  drawBody(ice_lever);
  drawBody(ice_chain);
  drawBody(ice_lever_weight);
  drawConstraint(ice_chain_top_constraint);
  drawConstraint(ice_chain_bottom_constraint);
  drawConstraint(ice_lever_constraint);
  drawBody(ice_final_ramp);
  drawBody(ice_launching_flat);
  drawBody(ice_launching_station);

  // if-statements to check for flag collisions and color changes
  if (ice_starting_flag_checkpoint) {
    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
  } else {
    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
  }
  drawBody(ice_starting_flag);
  if (second_ice_flag_checkpoint) {
    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
  } else {
    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
  }
  drawBody(second_ice_flag);
  if (third_ice_flag_checkpoint) {
    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
  } else {
    fill(255);
    stroke(255);
    drawBody(ice_plinko_ball_door);
    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
  }
  drawBody(third_ice_flag);
  if (fourth_ice_flag_checkpoint) {
    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
  } else {
    fill(255);
    stroke(255);
    drawBody(ice_basket_bottom);
    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
  }
  drawBody(fourth_ice_flag);
  textSize(170);
  textFont(ice_font);
  if (fifth_ice_flag_checkpoint) {

    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
    drawBody(fifth_ice_flag);
    fill(255);
    text('ON', ice_x + 4690, ice_y + 8460);

    fill("rgb(0, 255, 0)");
    stroke("rgb(0, 255, 0)");
    push();
    strokeWeight(4);
    line(ice_x + 4620, ice_y + 8400, ice_x + 3120, ice_y + 8400);
    line(ice_x + 3120, ice_y + 8400, ice_x + 3120, ice_y + 10400);
    line(ice_x + 3120, ice_y + 10400, ice_x + 1020, ice_y + 10400);
    line(ice_x + 1020, ice_y + 10400, ice_x - 500, ice_y + 11500);
    stroke(255);
    line(ice_x + 200, ice_y + 11600, ice_x + 1200, ice_y + 11600);
    line(ice_x + 100, ice_y + 11750, ice_x + 1100, ice_y + 11750);
    line(ice_x + 200, ice_y + 11900, ice_x + 1200, ice_y + 11900);
    line(ice_x + 100, ice_y + 12050, ice_x + 1100, ice_y + 12050);
    line(ice_x + 200, ice_y + 12200, ice_x + 1200, ice_y + 12200);
    pop();
    drawBody(ice_wind_generator);

    fill(255);
    text('WIND', ice_x - 725, ice_y + 11970);

  } else {

    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
    drawBody(fifth_ice_flag);
    fill(0);
    text('OFF', ice_x + 4650, ice_y + 8460);

    fill("rgb(255, 0, 0)");
    stroke("rgb(255, 0, 0)");
    push();
    strokeWeight(4);
    line(ice_x + 4620, ice_y + 8400, ice_x + 3120, ice_y + 8400);
    line(ice_x + 3120, ice_y + 8400, ice_x + 3120, ice_y + 10400);
    line(ice_x + 3120, ice_y + 10400, ice_x + 1020, ice_y + 10400);
    line(ice_x + 1020, ice_y + 10400, ice_x - 500, ice_y + 11500);
    pop();
    drawBody(ice_wind_generator);

    fill(0);
    text('WIND', ice_x - 725, ice_y + 11970);

  }

  // drawing space station fuel gauge
  rectMode(CENTER);
  fill("rgb(0, 255, 0)");
  stroke("rgb(0, 255, 0)");
  rect(ice_x + 15300, ice_y + 16685 - ice_fuel_gauge * 0.5, 800, ice_fuel_gauge);

  // drawing the plinko pegs and balls
  for (var i = 0; i < ice_plinko_pegs.length; i++) {
    ice_plinko_pegs[i].show();
  }
  for (var j = 0; j < ice_plinko_balls.length; j++) {
    ice_plinko_balls[j].show();
  }

  // drawing dominoes at the top
  for (let j = 0; j < ice_starting_dominoes.length; j++) {
    let currentDomino = ice_starting_dominoes[j].body;
    var vertices = currentDomino.vertices;
    fill(ice_starting_dominoes[j].rgb);
    stroke(ice_starting_dominoes[j].rgb);
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape();
  }

  // drawing the main entity
  fill(255);
  stroke(255);
  drawBody(ice_main_body);

  // starts the process after about 3 seconds
  if (iceFirstTime && frameCount >= 180) {
    let x = ice_starting_dominoes[0].body.position.x;
    let y = ice_starting_dominoes[0].body.position.y;
    Body.applyForce(ice_main_body, { x: ice_main_body.position.x, y: ice_main_body.position.y }, { x: 35, y: 0 });
    iceFirstTime = false;
    ICE_MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
  }

  // END OF ICE BIOME DRAW CODE

}


// SPACE

function spaceDraw() {
  if (space_followingMainBody) {
    space_moveWithMainBody(space_mainBody);
  }

  if (space_conditions.length > 0) {
    if (space_conditions[0].check()) {
      space_conditions[0].onceDone();
      space_conditions.shift();
    } else {
      space_conditions[0].notDone();
    }
  }
  clear();
  //background(bg);
  fill(128);
  drawSprite(space_greyPlanet, space_greyPlanetImg);
  drawSprite(space_bluePlanet, space_bluePlanetImg);
  drawSprite(space_redPlanet, space_redPlanetImg);
  drawSprite(space_brownPlanet, space_brownPlanetImg);
  drawSprite(space_orangePlanet, space_orangePlanetImg);
  drawSprite(space_sun, space_sunImg);

  drawSprite(space_rocketBody, space_rocketImg);

  space_ball[0].isStatic = true;
  if (space_blackHoleImg != null) {
    drawSprite(space_ball[0], space_blackHoleImg);
  }
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MAIN FUNCTIONS

function setup() {
  canvas = createCanvas(screen.availWidth, screen.availHeight, WEBGL);
  iceSetup();
  spaceSetup();
  Engine.run(engine);
}

function draw() {
  if (currentStage == "ice") {
    iceDraw();
  } else {
    spaceDraw();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////