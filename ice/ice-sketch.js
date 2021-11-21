
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

const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const drawMouse = Helpers.drawMouse;
const drawConstraint = Helpers.drawConstraint;


// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

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

var ice_pieces, ice_radius, ice_fft, ice_mapMouseX, ice_mapMouseY, ice_audio;
var ice_colorPalette = ["#0f0639", "#ff006a", "#ff4f00", "#00f9d9"];

let ice_first_time_audio = true;
let ice_audio_setup_completed = false;

// ice bodies and booleans/arrays
let ice_starting_rectangle;
let second_ice_starting_rectangle;
let ice_starting_raised_rectangle;
let ice_starting_dominoes = [];
let ice_starting_flag;
let second_ice_flag;
let third_ice_flag;
let ice_starting_flag_checkpoint = false;
let second_ice_flag_checkpoint = false;
let third_ice_flag_checkpoint = false;
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
let ice_chain;
let ice_chain_links;
let ice_chain_constraint;

// ice images
let ice_flag_image;

// ice conditions array
var ice_conditions = [];

// END OF ICE VARIABLE INITIALIZATION

// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

let engine;
let particles = [];
let pegs = [];
let mouse;
let mouseConstraint;

let attractorBody;

class Conditions {
    constructor(checkFunction, onceDoneFunction) {
      this.check = checkFunction;
      this.onceDone = onceDoneFunction;
    }
}

// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

// BEGINNING OF ICE FUNCTIONS

function randomNumber(lowerBound, upperBound) {
    return Math.floor((Math.random() * upperBound) + lowerBound);
}

function createPegs(x, y, rows, columns, spacing, radius) {
    var pegs = [];
    var startX = x;
    var tempX = startX + 0.5 * (spacing + 2 * radius);
    var tempY = y;
    for (var i = 0;i < rows;i++) {
        for (var j = 0;j < columns;j++) {
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

function createDominoes(x, y, width, height, dominoCount, spacing) {
    var dominoes = [];
    for (var i = 0;i < dominoCount;i++) {
        var rgb = "rgb(" + randomNumber(1, 255) + "," + randomNumber(1, 255) + "," + randomNumber(1, 255) + ")";
        dominoes.push(new IceDomino(x, y - height * 0.5, width, height, rgb));
        x += spacing + 0.5 * width;
    }
    return dominoes;
}

function createPlinkoBalls(numberOfBalls, sourceX, sourceY) {
    var particles = [];
    for (var i = 0;i < numberOfBalls;i++) {
        var rgb = "rgb(" + randomNumber(1, 255) + "," + randomNumber(1, 255) + "," + randomNumber(1, 255) + ")";
        particles.push(new IceParticlePlinko(sourceX, sourceY, randomNumber(10, 30), rgb));
    }
    return particles;
}

function spinPinwheels(pinwheelObjects) {
    for (var i = 0;i < pinwheelObjects.length;i++) {
        if (i < 2) {
            Body.setAngle(pinwheelObjects[i], pinwheelObjects[i].angle + pinwheelObjects[i].rotationSpeed);
        } else {
            Body.setAngle(pinwheelObjects[i], pinwheelObjects[i].angle - pinwheelObjects[i].rotationSpeed);
        }
    }
}

function MOVE_CAMERA(changeX, changeY, changeZ, durationInSeconds) {
    if (!iceCameraDebugging) {
        if (useIceCameraPanning) {
            moveCameraPan(changeX, changeY, changeZ, durationInSeconds, iceFramesPerSecond);
        } else {
            moveCamera(changeX, changeY, changeZ);
        }
    }
}

function moveCameraPan(changeX, changeY, changeZ, durationInSeconds, currentFrameCount) {
    iceCameraMoving = true;
    // var magnitude = Math.sqrt(Math.pow(changeX, 2) + Math.pow(changeY, 2) + Math.pow(changeZ, 2));
    var totalFrames = durationInSeconds * currentFrameCount;
    iceCameraChangeX = changeX / totalFrames;
    iceCameraChangeY = changeY / totalFrames;
    iceCameraChangeZ = changeZ / totalFrames;
    iceCameraTargetX = iceCameraX + changeX;
    iceCameraTargetY = iceCameraY + changeY;
    iceCameraTargetZ = iceCameraZ + changeZ;
}

function moveCamera(changeX, changeY, changeZ) {
    iceCameraX += changeX;
    iceCameraY += changeY;
    iceCameraZ += changeZ;
    iceCamera.move(changeX, changeY, changeZ);
}

document.documentElement.addEventListener(
    "mousedown", function() {
        iceOnClicked = true;
    }
);

// END OF ICE FUNCTIONS

// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

function setup() {

    // create the canvas, engine, and the camera
    const canvas = createCanvas(screen.availWidth, screen.availHeight, WEBGL);
    engine = Engine.create();
    world = engine.world;
    iceCamera = createCamera();
    
    // technically need to get current instance of camera from previous environment
    
    // starting camera spot for ice environment
    moveCamera(ice_x + 400, ice_y + 500, 0);
    
    // moveCamera(ice_x + 2000, ice_y + 8000, 5000);
    iceCameraX = iceCamera.centerX;
    iceCameraY = iceCamera.centerY;
    iceCameraZ = iceCamera.centerZ;

    // ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
    // ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
    // ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
    // ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
    // ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
    // ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

    // BEGINNING OF ICE SETUP CODE

    // creating all of the bodies
    ice_starting_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 420, 660, 60, { isStatic: true });
    second_ice_starting_rectangle = Bodies.rectangle(ice_x + 1160, ice_y + 420, 1000, 60, { isStatic: true });
    ice_starting_raised_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 370, 660, 40, { isStatic: true });
    ice_starting_dominoes = createDominoes(ice_x + 685, ice_y + 340, 20, 100, 17, 15);
    ice_main_body = Bodies.circle(ice_x + 100, ice_y + 300, 40, { density: 0.11 });
    ice_starting_flag = Bodies.rectangle(ice_x + 1260, ice_y + 360, 60, 60, { isStatic: true });
    ice_curve_vertices = [
        { x : 0 , y : 0 },
        { x : 60 , y : 250 },
        { x : 120 , y : 480 },
        { x : 180 , y : 690 },
        { x : 240 , y : 880 },
        { x : 300 , y : 1050 },
        { x : 360 , y : 1200 },
        { x : 420 , y : 1330 },
        { x : 480 , y : 1440 },
        { x : 540 , y : 1520 },
        { x : 570 , y : 1550},
        { x : 600 , y : 1560 },
        { x : 640 , y : 1550 },
        { x : 680 , y : 1540 },
        { x : 760 , y : 1500 },
        { x : 760 , y : 2000 },
        { x : -660 , y : 2000 },
        { x : -660 , y : 0 }
    ];
    ice_curve = Bodies.fromVertices(ice_x + 860, ice_y + 1635, ice_curve_vertices, { isStatic: true, friction: 0, restitution: 1 }, [flagInternal=false], [removeCollinear=0.01], [minimumArea=10], [removeDuplicatePoints=0.01]);
    second_ice_flag = Bodies.rectangle(ice_x + 1465, ice_y + 1985, 60, 60, { isStatic: true });
    ice_plinko_pegs = createPegs(ice_x + 1600, ice_y + 2050, 15, 13, 100, 30);
    ice_landing_rectangle = Bodies.rectangle(ice_x + 4300, ice_y + 2080, 1000, 120, { isStatic: true });
    third_ice_flag = Bodies.rectangle(ice_x + 4350, ice_y + 2050, 60, 60, { isStatic: true });
    ice_plinko_ball_cover = Bodies.rectangle(ice_x + 2570, ice_y - 290, 1360, 20, { isStatic: true });
    ice_plinko_ball_left_wall = Bodies.rectangle(ice_x + 1900, ice_y + 200, 20, 1000, { isStatic: true });
    ice_plinko_ball_right_wall = Bodies.rectangle(ice_x + 3240, ice_y + 200, 20, 1000, { isStatic: true });
    ice_plinko_ball_door = Bodies.rectangle(ice_x + 2570, ice_y + 690, 1360, 20, { isStatic: true });
    ice_plinko_balls = createPlinkoBalls(10, ice_x + 2570, ice_y + 200);
    ice_plinko_left_boundary = Bodies.rectangle(ice_x + 1350, ice_y + 4000, 20, 3800, { isStatic: true });
    ice_plinko_right_boundary = Bodies.rectangle(ice_x + 3875, ice_y + 4000, 20, 3800, { isStatic: true });
    Body.rotate(ice_plinko_left_boundary, 3);
    Body.rotate(ice_plinko_right_boundary, -3);
    ice_slant_one = Bodies.rectangle(ice_x + 2270, ice_y + 6200, 2500, 40, { isStatic: true, friction: 0 });
    ice_slant_two = Bodies.rectangle(ice_x + 2870, ice_y + 6800, 2500, 40, { isStatic: true, friction: 0 });
    ice_slant_three = Bodies.rectangle(ice_x + 2270, ice_y + 7400, 2500, 40, { isStatic: true, friction: 0 });
    ice_slant_four = Bodies.rectangle(ice_x + 2870, ice_y + 8000, 2500, 40, { isStatic: true, friction: 0 });
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
    ice_lever = Bodies.rectangle(ice_x + 3920, ice_y + 9280, 4600, 40, { isStatic: true });

    // attractorBody = Matter.Bodies.circle(ice_x + 2870, ice_y + 7900, 40, {
    //     plugin: {
    //         attractors: [
    //             function(attractorBody, otherBody) {
    //                 return {
    //                     x: (attractorBody.position.x - otherBody.position.x) * 1e-6,
    //                     y: (attractorBody.position.y - otherBody.position.y) * 1e-6,
    //                 };
    //             }
    //         ]
    //     }
    // });

    // adding all bodies into one array and adding them into the world
    var iceBodies = [ice_starting_rectangle, second_ice_starting_rectangle, ice_main_body, ice_starting_raised_rectangle, ice_starting_flag, ice_curve, second_ice_flag, ice_plinko_pegs, ice_landing_rectangle, 
        third_ice_flag, ice_plinko_ball_cover, ice_plinko_ball_left_wall, ice_plinko_ball_right_wall, ice_plinko_ball_door, ice_plinko_left_boundary, ice_plinko_right_boundary, ice_slant_one, ice_slant_two,
        ice_slant_three, ice_slant_four, ice_spin_left_vertical, ice_spin_left_horizontal, ice_spin_right_vertical, ice_spin_right_horizontal, ice_basket_left_wall, ice_basket_right_wall, ice_basket_bottom, 
        ice_lever];
    for (var i = 0;i < ice_starting_dominoes.length;i++) {
        iceBodies.push(ice_starting_dominoes[i]);
    }
    for (var j = 0;j < ice_plinko_balls.length;j++) {
        iceBodies.push(ice_plinko_balls[j]);
    }
    World.add(world, iceBodies);

    // END OF ICE SETUP CODE

    // ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
    // ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
    // ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
    // ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
    // ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
    // ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

    // setup mouse
    // mouse = Mouse.create(canvas.elt);
    // const mouseParams = {
    //     mouse: mouse,
    //         constraint: { stiffness: 0.05 }
    // }
    // mouseConstraint = MouseConstraint.create(engine, mouseParams);
    // mouseConstraint.mouse.pixelRatio = pixelDensity();
    // World.add(world, mouseConstraint);

    // run the engine
    Engine.run(engine);

}

// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

// BEGINNING OF ICE CONDITIONS CODE

var firstTime = true;

ice_conditions.push(
    new Conditions(
      () => {
        return Matter.SAT.collides(ice_starting_dominoes[ice_starting_dominoes.length - 1].body, ice_starting_flag).collided;
      },
      () => {
        ice_starting_flag_checkpoint = true;
        Matter.Body.setPosition(second_ice_starting_rectangle, {x: ice_x + 1250, y: ice_y + 420}); 
        // MOVE_CAMERA(1200, 800, 2000, iceCameraPanningSpeed);
        MOVE_CAMERA(4200, 1600, 6500, iceCameraPanningSpeed);
      }
    )
);

ice_conditions.push(
    new Conditions(
      () => {
        return Matter.SAT.collides(ice_main_body, second_ice_flag).collided;
      },
      () => {
        second_ice_flag_checkpoint = true;
        Body.applyForce(ice_main_body, {x: ice_main_body.position.x, y: ice_main_body.position.y}, {x: 60, y: -60});
        // MOVE_CAMERA(400, 200, 0, iceCameraPanningSpeed);
        MOVE_CAMERA(0, 2700, 500, iceCameraPanningSpeed);
      }
    )
);

ice_conditions.push(
    new Conditions(
      () => {
        return Matter.SAT.collides(ice_main_body, third_ice_flag).collided;
      },
      () => {
        third_ice_flag_checkpoint = true;
        World.remove(world, ice_plinko_ball_door);
        // MOVE_CAMERA(0, 1700, 0, iceCameraPanningSpeed);
        MOVE_CAMERA(0, 8000, 0, iceCameraPanningSpeed * 10);
      }
    )
);

// END OF ICE CONDITIONS CODE

// ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
// ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
// ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
// ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
// ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
// ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

function draw() {

    // ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
    // ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
    // ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
    // ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
    // ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
    // ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

    // BEGINNING OF ICE BIOME DRAW CODE
    
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
        ice_pieces = 4;
        ice_radius = screen.availHeight / 4;
        ice_audio_setup_completed = true;
    }

    // code to pan camera with desired vectors
    if (iceCameraMoving) {
        iceCameraX += iceCameraChangeX;
        iceCameraY += iceCameraChangeY;
        iceCameraZ += iceCameraChangeZ;
        moveCamera(iceCameraChangeX, iceCameraChangeY, iceCameraChangeZ);
        var currentCoordinates = [iceCameraX, iceCameraY, iceCameraZ];
        var coordinateChange = [iceCameraChangeX, iceCameraChangeY, iceCameraChangeZ];
        var targetCoordinates = [iceCameraTargetX, iceCameraTargetY, iceCameraTargetZ];
        var coordinatesAchieved = [false, false, false];
        for (var i = 0;i < currentCoordinates.length;i++) {
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
        for (var i = ice_conditions.length - 1;i >= 0;i--) {
            condition = ice_conditions[i];
            if (condition.check()) {
                condition.onceDone();
                ice_conditions.splice(i, 1);
            }
        }
    }



    if (ice_audio_setup_completed) {
        // find an audio visual code
        // or... make your own

        background(0);

        // var centerX = iceCamera.centerX;
        // var centerY = iceCamera.centerY;

        // var numLayers = 100;
        // var spacing = 10;
        // var maxHorizRadius = numLayers * spacing;

        // var colorPalette = ["#0f0639", "#ff006a", "#ff4f00", "#00f9d9"];

        // var angle = Math.PI / 18;
        // var numLayersToRotate = 1;

        // for (var i = 1;i < numLayers;i++) {
        //     stroke(colorPalette[i % 4]);
        //     strokeWeight(1);
        //     var Radius = 10;
        //     if (i <= numLayersToRotate) {
        //         line((cos(angle) * Radius) + centerX - maxHorizRadius, (sin(angle) * Radius) + centerY - maxHorizRadius, (cos(angle) * Radius) + centerX + maxHorizRadius, (sin(angle) * Radius) + centerY - maxHorizRadius);
        //         line((cos(angle) * Radius) + centerX + maxHorizRadius, (sin(angle) * Radius) + centerY - maxHorizRadius, (cos(angle) * Radius) + centerX + maxHorizRadius, (sin(angle) * Radius) + centerY + maxHorizRadius);
        //         line((cos(angle) * Radius) + centerX + maxHorizRadius, (sin(angle) * Radius) + centerY + maxHorizRadius, (cos(angle) * Radius) + centerX - maxHorizRadius, (sin(angle) * Radius) + centerY + maxHorizRadius);
        //         line((cos(angle) * Radius) + centerX - maxHorizRadius, (sin(angle) * Radius) + centerY + maxHorizRadius, (cos(angle) * Radius) + centerX - maxHorizRadius, (sin(angle) * Radius) + centerY - maxHorizRadius);
        //     } else {
        //         line(centerX - maxHorizRadius, centerY - maxHorizRadius, centerX + maxHorizRadius, centerY - maxHorizRadius);
        //         line(centerX + maxHorizRadius, centerY - maxHorizRadius, centerX + maxHorizRadius, centerY + maxHorizRadius);
        //         line(centerX + maxHorizRadius, centerY + maxHorizRadius, centerX - maxHorizRadius, centerY + maxHorizRadius);
        //         line(centerX - maxHorizRadius, centerY + maxHorizRadius, centerX - maxHorizRadius, centerY - maxHorizRadius);
        //     }
        //     maxHorizRadius -= spacing; 
        // }

        // if (numLayersToRotate <= numLayers && increasingNumLayers) {
        //     numLayersToRotate++;
        //     if (numLayersToRotate == numLayers) {
        //         increasingNumLayers = false;
        //     }
        // } else {
        //     numLayersToRotate--;
        //     if (numLayersToRotate == 1) {
        //         increasingNumLayers = true;
        //     }
        // }
 
    } else {
        background(0);
    }


    // initial drawing
    // background(0);
    fill(255);
    stroke(255);

    // constant movement
    var pinwheelObjects = [ice_spin_left_vertical, ice_spin_left_horizontal, ice_spin_right_vertical, ice_spin_right_horizontal];
    spinPinwheels(pinwheelObjects);

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
    drawBody(ice_basket_bottom);
    drawBody(ice_lever);

    // for specifically drawing any rotating bodies
    // var vertice_drawing_group = [ice_spin_left_vertical, ice_spin_left_horizontal, ice_spin_right_vertical, ice_spin_right_horizontal];
    // for (let j = 0; j < vertice_drawing_group.length; j++) {
    //     var vertices = vertice_drawing_group[j].vertices;
    //     console.log(vertices);
    //     beginShape();
    //     for (var i = 0; i < vertices.length; i++) {
    //         vertex(vertices[i].x, vertices[i].y);
    //     }
    //     endShape();
    // }

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


    // drawing the plinko pegs and balls
    for (var i = 0;i < ice_plinko_pegs.length;i++) {
        ice_plinko_pegs[i].show();
    }
    for (var j = 0;j < ice_plinko_balls.length;j++) {
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
    if (firstTime && frameCount >= 180) {
        let x = ice_starting_dominoes[0].body.position.x;
        let y = ice_starting_dominoes[0].body.position.y;
        Body.applyForce(ice_main_body, {x: ice_main_body.position.x, y: ice_main_body.position.y}, {x: 35, y: 0});
        firstTime = false;
        // MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
        MOVE_CAMERA(500, 0, 0, iceCameraPanningSpeed);
    }

    // END OF ICE BIOME DRAW CODE

    // ██╗░█████╗░███████╗  ███████╗███╗░░██╗██╗░░░██╗██╗██████╗░░█████╗░███╗░░██╗███╗░░░███╗███████╗███╗░░██╗████████╗
    // ██║██╔══██╗██╔════╝  ██╔════╝████╗░██║██║░░░██║██║██╔══██╗██╔══██╗████╗░██║████╗░████║██╔════╝████╗░██║╚══██╔══╝
    // ██║██║░░╚═╝█████╗░░  █████╗░░██╔██╗██║╚██╗░██╔╝██║██████╔╝██║░░██║██╔██╗██║██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░
    // ██║██║░░██╗██╔══╝░░  ██╔══╝░░██║╚████║░╚████╔╝░██║██╔══██╗██║░░██║██║╚████║██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░
    // ██║╚█████╔╝███████╗  ███████╗██║░╚███║░░╚██╔╝░░██║██║░░██║╚█████╔╝██║░╚███║██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░
    // ╚═╝░╚════╝░╚══════╝  ╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

}