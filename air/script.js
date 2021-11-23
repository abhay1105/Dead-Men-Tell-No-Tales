// Benedikt Groß
// Example shows how to offset the centre of the mass to create a "Weeble"

// Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawSprite = Helpers.drawSprite;
const drawBodies = Helpers.drawBodies;
const drawConstraint = Helpers.drawConstraint;

let engine;
let circle;
let ground;
let spriteImg;

let airCatchHelicopter;
let airCatchCloth;
let airCatchConstraint1;
let airCatchConstraint2;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // bouncy circle with custom centre of mass
  circle = Bodies.circle(350, 50, 100, {
    restitution: 1, // bouncy
    frictionAir: 0.001
  });
  setMassCentre(circle, {x: 75, y: 0});
  Body.scale(circle, 0.75, 0.5);
  World.add(engine.world, [circle]);
  engine.world.gravity.y = 1;
  Body.applyForce(circle, {x: circle.position.x - 75, y: circle.position.y}, {x: 0, y: -0.1});

  // ground
  ground = Bodies.rectangle(400, height, 1000, 50, {
    isStatic: true,
    restitution: 1
  });
  World.add(engine.world, [ground]);

  // setup mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  airCatchCloth = createCloth(100, 150, 5, 10, 5, 5, true, 5);
  airCatchConstraint1 = Constraint.create({
    pointA: {x: 00, y: 100},
    bodyB:  airCatchCloth.bodies[0],
    stiffness: 1,
    length: 100,
  });
  airCatchConstraint2 = Constraint.create({
    pointA: {x: 250, y: 600},
    bodyB:  airCatchCloth.bodies[49],
    stiffness: 1,
    length: 100,
  })

  World.add(engine.world, airCatchCloth);
  World.add(engine.world, [airCatchConstraint1, airCatchConstraint2]);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  noStroke();
  fill(255);
  drawBody(circle);
  drawMassCenter(circle);

  fill(255);
  drawBodies(airCatchCloth.bodies);
  airCatchCloth.constraints.forEach(element => {
    drawConstraint(element);    
  });

  drawConstraint(airCatchConstraint1);

  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}

function setMassCentre(body, offset) {
  body.position.x += offset.x;
  body.position.y += offset.y;
  body.positionPrev.x += offset.x;
  body.positionPrev.y += offset.y;
}

function drawMassCenter(body) {
  fill('red');
  ellipse(body.position.x, body.position.y, 5, 5);
}

function drawSpriteWithOffset(body, img, offsetY, w, h) {
  const pos = body.position;
  push();
  translate(pos.x, pos.y);
  rotate(body.angle);
  imageMode(CENTER);
  image(img, 0, offsetY, w, h);
  pop();
}