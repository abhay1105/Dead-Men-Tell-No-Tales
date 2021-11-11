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

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
//^^ I have no idea what the difference is between this one and the one above
//^^ Update, I think that's just to draw multiple bodies at hence (since a bridge is made of multiple bodies of rects)
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;
let ball;

// the top screw on
let topConstraint;
let bottomConstraint;
let constraint4;

// the slingshot shape
let rect1;
let rectTwo;
let baseRect;
let middleRect;
let leftPost;
let rightPost;

//Bridge Var's
let bridge;

let bridgeLeftConstraint;
let bridgeRightConstraint;

// Canvas vars
let absoluteScreenWidth = screen.availWidth;
let absoluteScreenHeight = screen.availHeight;

let testCircle;

function setup() {
    const canvas = createCanvas(absoluteScreenWidth, absoluteScreenHeight);

    // create an engine
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0;
    
    //------------------------Bridge Stuff Start------------------------//

    // adding bridge
    const group = Body.nextGroup(true);
    const rects = Composites.stack(100, 102, 1, 35, 30, 5, function(x, y) {
        //stack syntax: xx, yy, col, row, colGap, rowGap, callback
        return Bodies.rectangle(x, y, 10, 10, { 
            collisionFilter: { group: group },
            // isStatic: true,
        });
    });
    bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 1.0, length: 1.0, render: {type: 'line'}});
    //Composites syntax: composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options(Ie stiffness, length, etc)
    World.add(engine.world, [bridge]);

    // left and right fix point of slingshot

    bridgeLeftConstraint = Constraint.create({
      pointA: {x: 175, y: 100}, // Original point
      bodyB: rects.bodies[0],
      pointB: {x: 0, y: 0},
      stiffness: 0.05
    })

    Composite.add(rects, bridgeLeftConstraint);

    bridgeRightConstraint = Constraint.create({
      pointA: {x: 175, y: 625},
      bodyB: rects.bodies[rects.bodies.length-1],
      pointB: {x: 0, y: 0},
      stiffness: 0.05
    })
    Composite.add(rects, bridgeRightConstraint);

    // add ball
    ball = Bodies.circle(400, 400, 20);
    World.add(engine.world, [ball]);
    
    // setup mouse
    const mouse = Mouse.create(canvas.elt);
    const mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    //--------------------- Begin forces setup -------------------------//
    bridge.bodies[bridge.bodies.length/2]

    testCircle = new Particle(100, 100, 20);

    // run the engine
    Engine.run(engine);
}

function draw() {
    background(0);
    // drawBody(rect1);
    // drawBody(rect2);
    noStroke();
    fill(128);
    stroke(128);
    strokeWeight(2);
    // drawConstraint(topConstraint);
    // drawConstraint(bottomConstraint);
    drawConstraint(bridgeLeftConstraint);
    drawConstraint(bridgeRightConstraint);
    //drawConstraint(bridge.constraints);
    // drawConstraint(constraint4);
    // drawBody(ground);
    // drawBody(baseRect);
    // drawBody(middleRect);
    // drawBody(leftPost);
    // drawBody(rightPost);
    drawBodies(bridge.bodies);
    drawBody(ball);
    
    testCircle.show();

    drawMouse(mouseConstraint);
}