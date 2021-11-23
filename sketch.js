////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let engine, world, canvas;
let currentStage = "rainforest";

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

  // rainforest
  rainforest_pirateImg = loadImage("./resources/pirateship.png");

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

let rainforest_cam;
let rainforest_boxes = [];
let rainforest_circles = [];
let rainforest_grounds = [];
let rainforest_mConstraint;
let rainforest_ground;
let rainforest_ground2;
let rainforest_canvas;
let rainforest_ball;
let rainforest_rope;
let rainforest_chain;
let rainforest_boxesChain;
let rainforest_car;
let rainforest_ice_curve;
let rainforest_ice_curve2;
let rainforest_carBallConstraint;
let rainforest_constrainOnce = false;
let rainforest_clicked = false;
let rainforest_trigger;
let rainforest_showTrigger = true;
let rainforest_plinko_pegs = [];
let rainforest_plinko_balls = [];
let rainforest_drop;
let rainforest_dropVertices;
let rainforest_pendulumStick;
let rainforest_pendulumBall;
let rainforest_pendulumConstraint;
let rainforest_ground3;
let rainforest_finalBall;
let rainforest_startEngine = false;
let rainforest_ramp;
let rainforest_rampRemoved = false;
let rainforest_startRotation = false;
let rainforest_rotationNum = Math.PI / 21
let rainforest_floatingBlocks = []
let rainforest_engine2 = false;
let rainforest_pirateImg;
let rainforest_hills = []

let rainforest_x = 0;
let rainforest_y = 0;

var rainforest_conditions = [];

class RainforestConditions {
  constructor(checkFunction, onceDoneFunction) {
    this.check = checkFunction;
    this.onceDone = onceDoneFunction;
  }
}

function rainforest_randomNumber(lowerBound, upperBound) {
  return Math.floor((Math.random() * upperBound) + lowerBound);
}

function rainforest_moveCam(mainBody) {
  rainforest_cam.setPosition(mainBody.body.position.x + 200, mainBody.body.position.y - 100, 500);
}

function rainforest_diffMoveCam(x, y, zoom) {
  rainforest_cam.setPosition(x, y, zoom);
}


// ICE


// BEGINNING OF ICE VARIABLE INITIALIZATION

// ice environment
let ice_x = rainforest_x + 6750;
let ice_y = rainforest_y + 4650;

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






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SETUP FUNCTIONS


// AIR




// RAINFOREST

function rainforestSetup() {
  rainforest_cam = createCamera()
  let pi = Math.PI

  rainforest_ramp = Bodies.rectangle(rainforest_x + 1020, rainforest_y + 407, 600, 100, { isStatic: true })
  World.add(world, rainforest_ramp)

  rainforest_ball = new Ball(rainforest_x + -600, rainforest_y - 200, 30)
  rainforest_finalBall = Bodies.circle(rainforest_x + 6450, rainforest_y + 4500, 40, { density: 0.11 });
  // finalBall = new Ball(5000, 4000, 30, {isStatic: true})
  World.add(world, rainforest_finalBall)
  rainforest_ground = Bodies.rectangle(rainforest_x + 0, rainforest_y + 407, width, 100, { isStatic: true })
  World.add(world, rainforest_ground)

  rainforest_ground2 = Bodies.rectangle(rainforest_x + 2500, rainforest_y + 2500, 5500, 100, { isStatic: true })
  World.add(world, rainforest_ground2)

  rainforest_ground3 = Bodies.rectangle(rainforest_x + 6450, rainforest_y + 4600, 100, 100, { isStatic: true })
  World.add(world, rainforest_ground3)

  rainforest_pendulumBall = Bodies.circle(rainforest_x + 6300, rainforest_y + 4300, 50, { isStatic: false })
  rainforest_pendulumConstraint = Constraint.create({
    pointA: { x: rainforest_x + 6300, y: rainforest_y + 4100 },
    bodyB: rainforest_pendulumBall,
    length: 400,
    stiffness: 0.4
  })
  World.add(world, rainforest_pendulumConstraint)
  World.add(world, rainforest_pendulumBall)

  // floatingBlocks.push(
  //     Bodies.rectangle(1020, 600, 600, 100, {isStatic: true}),
  //     Bodies.rectangle(1420, 800, 600, 100, {isStatic: true}),
  //     Bodies.rectangle(1020, 1000, 600, 100, {isStatic: true}),
  //     Bodies.rectangle(1420, 1200, 600, 100, {isStatic: true}),
  // )
  for (var i = 0; i < rainforest_floatingBlocks.length; i++) {

  }
  World.add(world, rainforest_floatingBlocks)
  // boxes.push(new TreeTrunk(700, 250, 30, 220))
  // circles.push(new TreeTop(700, 65, 75))

  // boxes.push(new TreeTrunk(1200, 250, 30, 220))
  // circles.push(new TreeTop(1200, 65, 75))

  // boxes.push(new TreeTrunk(1500, 250, 30, 220))
  // circles.push(new TreeTop(1500, 65, 75))

  rainforest_dropVertices = [
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

  rainforest_drop = Bodies.fromVertices(rainforest_x + 5600, rainforest_y + 4200, rainforest_dropVertices, { isStatic: true, friction: 0, restitution: 1 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);

  World.add(world, rainforest_drop)


  rainforest_car = Composites.car(rainforest_x + -600, rainforest_y - 100, 200, 40, 40);
  World.add(world, rainforest_car)

  rainforest_trigger = Bodies.rectangle(rainforest_x + 5350, rainforest_y + 2500, 200, 100, { isStatic: true })
  World.add(world, rainforest_trigger)


  let rainforest_wave_vertices = []

  let num = 30
  let change = (2 * pi) / num

  for (var i = 0; i < (2 * pi); i += change) {
    x = i;
    y = Math.sin(i + (3 * pi / 2)) + 1

    console.log(200 * x, -1000 * y)

    rainforest_wave_vertices.push({ x: 200 * x, y: -400 * y })
  }

  console.log(rainforest_wave_vertices)

  // ice_curve = Bodies.fromVertices(2500, 2375, rainforest_wave_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);

  // ice_curve2 = Bodies.fromVertices(3200, 2375, rainforest_wave_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);

  rainforest_hills.push(Bodies.fromVertices(rainforest_x + 3000, rainforest_y + 2200, rainforest_wave_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]), Bodies.fromVertices(rainforest_x + 4300, rainforest_y + 2200, rainforest_wave_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]), Bodies.fromVertices(rainforest_x + 1800, rainforest_y + 2200, rainforest_wave_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]))

  World.add(world, rainforest_hills)

  // ice_curve = Bodies.rectangle(0, 0, 200, 100, {chamfer: {radius: 50}})
  // World.add(world, ice_curve)
  // World.add(world, ice_curve2)
  console.log(rainforest_ball)
  console.log(rainforest_car)

  // Body.applyForce(ball.body, ball.body.position, {x: 0.5, y: 0})
}


// ICE

function iceSetup() {

  // iceCamera = createCamera();
  // technically need to get current instance of camera from previous environment
  // starting camera spot for ice environment
  // iceMoveCamera(ice_x + 400, ice_y + 500, 0);
  // ICE_MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
  // moveCamera(ice_x + 15000, ice_y + 15000, 6000);
  // iceCameraX = iceCamera.centerX;
  // iceCameraY = iceCamera.centerY;
  // iceCameraZ = iceCamera.centerZ;

  // BEGINNING OF ICE SETUP CODE

  // creating all of the ice bodies
  ice_starting_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 420, 660, 60, { isStatic: true });
  second_ice_starting_rectangle = Bodies.rectangle(ice_x + 1160, ice_y + 420, 1000, 60, { isStatic: true });
  ice_starting_raised_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 370, 660, 40, { isStatic: true });
  ice_starting_dominoes = iceCreateDominoes(ice_x + 685, ice_y + 340, 20, 100, 17, 15);
  // ice_main_body = Bodies.circle(ice_x + 100, ice_y + 300, 40, { density: 0.11 });
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
  ice_lever = Bodies.rectangle(ice_x + 3280, ice_y + 9470, 4600, 40);
  ice_chain = Bodies.rectangle(ice_x + 5920, ice_y + 9930, 120, 1400);
  ice_lever_weight = Bodies.circle(ice_x + 5920, ice_y + 9250, 300);
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
  // removed ice_main_body
  ice_all_bodies = [ice_starting_rectangle, second_ice_starting_rectangle, ice_starting_raised_rectangle, ice_starting_flag, ice_curve, second_ice_flag, ice_plinko_pegs, ice_landing_rectangle,
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





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CONDITIONS CODE

// AIR





// RAINFOREST

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_ball.body, rainforest_car.bodies[0]).collided;
    },
    () => {
      console.log("ADDED CONSTRAINT")

      if (!rainforest_constrainOnce) {
        rainforest_constrainOnce = true
        let options = {
          bodyA: rainforest_car.bodies[0],
          bodyB: rainforest_ball.body,
          length: 50,
          stiffness: 1
        }
        rainforest_carBallConstraint = Constraint.create(options)
        World.add(world, rainforest_carBallConstraint)
        rainforest_startEngine = true;

        // Body.applyForce(car.bodies[0], car.bodies[0].position, {x: 3.2, y: 0.0})

      }

    }
  )
)

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_car.bodies[1], rainforest_ramp).collided;
    },
    () => {
      console.log("ADDED CONSTRAINT")
      rainforest_rampRemoved = true
      rainforest_startEngine = false
      rainforest_startRotation = true
      World.remove(world, rainforest_ramp)

    }
  )
)

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_car.bodies[0], rainforest_drop).collided;
    },
    () => {
      console.log("touched the drop")
      rainforest_startRotation = true
    }
  )
)

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_car.bodies[1], rainforest_ground2).collided;
    },
    () => {
      console.log("ADDED CONSTRAINT")
      // startEngine = true                
    }
  )
)

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_car.bodies[1], rainforest_trigger).collided;
    },
    () => {
      console.log("ADDED CONSTRAINT2")

      World.remove(world, rainforest_trigger)
      rainforest_showTrigger = false;
      rainforest_startEngine = false;
      // Body.applyForce(rainforest_car.bodies[1], rainforest_car.bodies[1].position, {x: 0, y: 0.5})
    }
  )
)

rainforest_conditions.push(
  new RainforestConditions(
    () => {
      return Matter.SAT.collides(rainforest_finalBall, rainforest_pendulumBall).collided;
    },
    () => {
      console.log("ADDED CONSTRAINT2")

      Body.applyForce(rainforest_finalBall, rainforest_finalBall.position, { x: 35, y: 0 });
      iceCamera = rainforest_cam;
      currentStage = "ice";
      iceMoveCamera(ice_x + 4500, ice_y + 2900, 0);
      ICE_MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
      iceCameraX = iceCamera.centerX;
      iceCameraY = iceCamera.centerY;
      iceCameraZ = iceCamera.centerZ;
      ice_main_body = rainforest_finalBall;
    }
  )
)


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
        if (position.x > ice_x - 500 && position.y > ice_y + 11500 && position.y < ice_y + 12300) {
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
    }
  )
);

// END OF ICE CONDITIONS CODE




// SPACE






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DRAW FUNCTIONS


// AIR




// RAINFOREST

function rainforestDraw() {
  background(51);

  if (rainforest_conditions.length > 0) {
    for (var i = rainforest_conditions.length - 1; i >= 0; i--) {
      rainforest_condition = rainforest_conditions[i];
      if (rainforest_condition.check()) {
        console.log("THEY HIT")
        console.log(i)
        rainforest_condition.onceDone();
        rainforest_conditions.splice(i, 1);
      }
    }
  }
  // Engine.update(engine);
  for (let rainforest_box of rainforest_boxes) {
    rainforest_box.show();
  }
  rainforest_ball.show()
  drawBody(rainforest_finalBall)
  for (let rainforest_circle of rainforest_circles) {
    rainforest_circle.show()
  }
  rainforest_pirateImg.resize(300, 150)


  // drawBody(ice_curve)
  // drawBody(ice_curve2)
  drawBody(rainforest_ground3)
  drawBody(rainforest_pendulumBall)


  fill(0, 153, 255)
  drawSprite(rainforest_car.bodies[0], rainforest_pirateImg)
  // drawBodies(car.bodies)
  drawBody(rainforest_ground)
  drawBody(rainforest_ground2)
  if (rainforest_showTrigger) {
    drawBody(rainforest_trigger)

  }

  if (!rainforest_rampRemoved) {
    drawBody(rainforest_ramp)
  }

  drawBody(rainforest_drop)

  if (rainforest_engine2) {
    Body.setVelocity(car.bodies[2], rainforest_rotationNum)
  }

  if (rainforest_startEngine) {
    console.log("ENGINE STARTING")
    Body.setVelocity(rainforest_car.bodies[0], { x: 5, y: 0 })
  }

  if (rainforest_startRotation) {
    Body.setAngularVelocity(rainforest_car.bodies[1], rainforest_rotationNum)
  }

  if (rainforest_showTrigger) {
    rainforest_moveCam(rainforest_ball)
  } else {
    rainforest_diffMoveCam(rainforest_x + 5500, rainforest_y + 4200, 1000)
  }

  for (let i = 0; i < rainforest_hills.length; i++) {
    drawBody(rainforest_hills[i])
  }

  stroke(255)
  line(rainforest_x + 6300, rainforest_y + 4100, rainforest_pendulumBall.position.x, rainforest_pendulumBall.position.y)
}


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
        console.log(error);
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
  // if (iceFirstTime && frameCount >= 180) {
  //   let x = ice_starting_dominoes[0].body.position.x;
  //   let y = ice_starting_dominoes[0].body.position.y;
  //   Body.applyForce(ice_main_body, { x: ice_main_body.position.x, y: ice_main_body.position.y }, { x: 35, y: 0 });
  //   iceFirstTime = false;
  //   ICE_MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
  // }

  // END OF ICE BIOME DRAW CODE

}


// SPACE




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MAIN FUNCTIONS

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  rainforestSetup();
  iceSetup();
  Engine.run(engine);
}

function draw() {
  if (currentStage == "rainforest") {
    rainforestDraw();
  } else if (currentStage == "ice") {
    iceDraw();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////