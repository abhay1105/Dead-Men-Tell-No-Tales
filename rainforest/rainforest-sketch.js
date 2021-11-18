// Example based on https://www.youtube.com/watch?v=urR596FsU68
// 5.17: Introduction to Matter.js - The Nature of Code
// by @shiffman

// module aliases

var Engine = Matter.Engine,
    //    Render = Matter.Render,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Body = Matter.Body;

const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
//^^ I have no idea what the difference is between this one and the one above
//^^ Update, I think that's just to draw multiple bodies at hence (since a bridge is made of multiple bodies of rects)
const drawConstraint = Helpers.drawConstraint;

let cam;
let engine;
let world;
let boxes = [];
let circles = [];
let grounds = [];
let mConstraint;
let ground;
let canvas;
let ball;
let rope;
let chain;
let boxesChain;
let car;

var conditions = [];

class Conditions {
    constructor(checkFunction, onceDoneFunction) {
        this.check = checkFunction;
        this.onceDone = onceDoneFunction;
    }
}

conditions.push(
    new Conditions(
        () => {
            return ball.body.position.y >= height/2 + 40;
        },
        () => {
            Body.applyForce(ball.body, ball.body.position, { x: 0.5, y: 0.05 });
        }
    )
);

function setup() {
    canvas = createCanvas(screen.availWidth, screen.availHeight - 110, WEBGL);
    engine = Engine.create();
    world = engine.world;
    cam = createCamera()
    //  Engine.run(engine);
    let mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio = pixelDensity() // for retina displays etc
    let options = {
        mouse: mouse
    }
    ball = new Ball(-700, 200, 20)
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
    ground = Bodies.rectangle(0, height / 2 + 40, width, 100, { isStatic: true })
    World.add(world, ground)
    boxes.push(new TreeTrunk(-500, 250, 30, 220))
    circles.push(new TreeTop(-500, 65, 75))

    boxes.push(new TreeTrunk(-300, 250, 30, 220))
    circles.push(new TreeTop(-300, 65, 75))

    boxes.push(new TreeTrunk(-100, 250, 30, 220))
    circles.push(new TreeTop(-100, 65, 75))

    car = Composites.car(300, 100, 200, 30, 30);
    World.add(world, car)



}

function moveCam(mainBody) {
    cam.setPosition(mainBody.body.position.x + 200, mainBody.body.position.y - 200, 500)
}

function draw() {
    background(51);


    if (conditions.length > 0) {
        if (conditions[0].check()) {
            conditions[0].onceDone();
            conditions.shift();
        }
    }

    Engine.update(engine);
    for (let box of boxes) {
        box.show();
    }
    ball.show()
    for (let circle of circles) {
        circle.show()
    }

    drawBodies(car.bodies)

    moveCam(ball)

}