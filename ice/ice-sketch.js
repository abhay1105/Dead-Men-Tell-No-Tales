
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;
const drawConstraint = Helpers.drawConstraint;

// ice environment
let iceCamera;
let ice_x = 0;
let ice_y = 0;

// ice bodies
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

// ice images
let ice_flag_image;

// ice conditions
var ice_conditions = [];

let engine;
let particles = [];
let pegs = [];
let mouse;
let mouseConstraint;

class Conditions {
    constructor(checkFunction, onceDoneFunction) {
      this.check = checkFunction;
      this.onceDone = onceDoneFunction;
    }
}

function preload() {
    ice_flag_image = loadImage("flag.png");
}

function randomNumber(lowerBound, upperBound) {
    return Math.floor((Math.random() * upperBound) + lowerBound);
}

function createPegs(x, y, rows, columns, spacing, radius) {
    var pegs = [];
    var startX = x;
    var tempX = startX + 0.5 * (spacing + 2 * radius);
    var tempY = y;
    for (var i = 0;i < rows;i++) {
        console.log("TEMP X:   " + tempX);
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

function moveCamera(newPositionX, newPositionY, newPositionZ) {
    iceCamera.move(newPositionX, newPositionY, newPositionZ);
}

function setup() {

    // create the canvas, engine, and the camera
    const canvas = createCanvas(screen.availWidth, screen.availHeight, WEBGL);
    engine = Engine.create();
    world = engine.world;
    iceCamera = createCamera();
    moveCamera(ice_x + 400, ice_y + 500, 0);

    // create all ice objects here
    ice_starting_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 420, 660, 60, { isStatic: true });
    second_ice_starting_rectangle = Bodies.rectangle(ice_x + 1160, ice_y + 420, 1000, 60, { isStatic: true });
    ice_starting_raised_rectangle = Bodies.rectangle(ice_x + 330, ice_y + 370, 660, 40, { isStatic: true });
    // pegs = createPegs(500, 600, 5, 14, 98, 10);
    ice_starting_dominoes = createDominoes(ice_x + 700, ice_y + 340, 20, 100, 14, 20);
    ice_main_body = Bodies.circle(ice_x + 100, ice_y + 300, 40, { density: 0.1 });
    // ice_starting_flag = new Flag(ice_flag_image, ice_x + 1460, ice_y + 400);
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
    ice_curve = Bodies.fromVertices(ice_x + 860, ice_y + 1635, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal=false], [removeCollinear=0.01], [minimumArea=10], [removeDuplicatePoints=0.01]);
    second_ice_flag = Bodies.rectangle(ice_x + 1465, ice_y + 1985, 60, 60, { isStatic: true });
    ice_plinko_pegs = createPegs(ice_x + 1600, ice_y + 2050, 15, 13, 100, 30);
    ice_landing_rectangle = Bodies.rectangle(ice_x + 4300, ice_y + 2080, 1000, 120, { isStatic: true });
    third_ice_flag = Bodies.rectangle(ice_x + 4350, ice_y + 2050, 60, 60, { isStatic: true });
    ice_plinko_ball_cover = Bodies.rectangle(ice_x + 2570, ice_y - 290, 1360, 20, { isStatic: true });
    ice_plinko_ball_left_wall = Bodies.rectangle(ice_x + 1900, ice_y + 200, 20, 1000, { isStatic: true });
    ice_plinko_ball_right_wall = Bodies.rectangle(ice_x + 3240, ice_y + 200, 20, 1000, { isStatic: true });
    ice_plinko_ball_door = Bodies.rectangle(ice_x + 2570, ice_y + 690, 1360, 20, { isStatic: true });
    ice_plinko_balls = createPlinkoBalls(120, ice_x + 2570, ice_y + 200);

    // setup mouse
    // mouse = Mouse.create(canvas.elt);
    // const mouseParams = {
    //     mouse: mouse,
    //         constraint: { stiffness: 0.05 }
    // }
    // mouseConstraint = MouseConstraint.create(engine, mouseParams);
    // mouseConstraint.mouse.pixelRatio = pixelDensity();
    // World.add(world, mouseConstraint);

    // adding all ice objects into one ice bodies array
    var iceBodies = [ice_starting_rectangle, second_ice_starting_rectangle, ice_main_body, ice_starting_raised_rectangle, ice_starting_flag, ice_curve, second_ice_flag, ice_plinko_pegs, ice_landing_rectangle, 
        third_ice_flag, ice_plinko_ball_cover, ice_plinko_ball_left_wall, ice_plinko_ball_right_wall, ice_plinko_ball_door];
    for (var i = 0;i < ice_starting_dominoes.length;i++) {
        iceBodies.push(ice_starting_dominoes[i]);
    }
    for (var j = 0;j < ice_plinko_balls.length;j++) {
        iceBodies.push(ice_plinko_balls[j]);
    }
    World.add(world, iceBodies);

    // run the engine
    Engine.run(engine);

}

var firstTime = true;

ice_conditions.push(
    new Conditions(
      () => {
        return Matter.SAT.collides(ice_starting_dominoes[ice_starting_dominoes.length - 1].body, ice_starting_flag).collided;
      },
      () => {
        ice_starting_flag_checkpoint = true;
        Matter.Body.setPosition(second_ice_starting_rectangle, {x: ice_x + 1250, y: ice_y + 420}); 
        moveCamera(1200, 800, 2000);
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
        Body.applyForce(ice_main_body, {x: ice_main_body.position.x, y: ice_main_body.position.y}, {x: 56, y: -56});
        moveCamera(400, 200, 0);
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
      }
    )
);

function draw() {

    if (ice_conditions.length > 0) {
        for (var i = ice_conditions.length - 1;i >= 0;i--) {
            condition = ice_conditions[i];
            if (condition.check()) {
                condition.onceDone();
                ice_conditions.splice(i, 1);
            }
        }
    }

    // Engine.update(engine);

    // ice biome draw code

    // if (frameCount % 30 == 0) {
    //     var x = randomNumber(100, screen.availWidth - 100);
    //     var y = 20;
    //     var radius = 20;
    //     var p = new IceParticlePlinko(x, y, radius, "rgb(" + randomNumber(1, 255) + "," + randomNumber(1, 255) + "," + randomNumber(1, 255) + ")");
    //     particles.push(p);
    // }

    background(0);
    fill(255);
    stroke(255);
    drawBody(ice_starting_rectangle);
    drawBody(ice_starting_raised_rectangle);
    drawBody(second_ice_starting_rectangle);
    drawBody(ice_curve);
    drawBody(ice_landing_rectangle);
    drawBody(ice_plinko_ball_cover);
    drawBody(ice_plinko_ball_left_wall);
    drawBody(ice_plinko_ball_right_wall);

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
    // for (var i = 0;i < particles.length;i++) {
    //     particles[i].show();
    // }
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

    fill(255);
    stroke(255);
    drawBody(ice_main_body);
    
    if (firstTime && frameCount >= 180) {
        let x = ice_starting_dominoes[0].body.position.x;
        let y = ice_starting_dominoes[0].body.position.y;
        Body.applyForce(ice_main_body, {x: ice_main_body.position.x, y: ice_main_body.position.y}, {x: 35, y: 0});
        firstTime = false;
        moveCamera(500, 0, 0);
    }

}