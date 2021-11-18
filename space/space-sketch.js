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

let engine;

let orangePlanet1;
let orangePlanetImg1;

let orangePlanet2;

let screenTop;
engine = Engine.create();

let rocketImg;
let rocketBody;

let explosionImg;

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
      return rocketBody.position.y < -20;
    },
    () => {
      Body.applyForce(rocketBody, rocketBody.position, { x: 0.5, y: 0.05 });
    }
  )
);

conditions.push(
  new Conditions(
    () => {
      return Matter.SAT.collides(rocketBody, orangePlanet1).collided;
    },
    () => {
      explosionImg = createImg("explosion-gif.gif", WEBGL);
      explosionImg.position(
        screen.availWidth / 2 - 80,
        screen.availHeight / 2 - 105
      );
    }
  )
);
conditions.push(
  new Conditions(
    () => {
      return !Matter.SAT.collides(rocketBody, orangePlanet1).collided;
    },
    () => {
      explosionImg.remove();
    }
  )
);

function setup() {
  createCanvas(screen.availWidth, screen.availHeight, WEBGL);

  cam = createCamera();
  // create an engine
  //engine.world.gravity.x = 0.5;
  engine.world.gravity.y = -0.0;
  // xx, yy, sides, radius?

  rocketBody = Bodies.rectangle(0, 0, 150, 60);
  rocketImg = loadImage("rocket-ship-image.png");

  World.add(engine.world, rocketBody);

  orangePlanetImg1 = loadImage("orangePlanet.png");

  orangePlanet1 = Bodies.circle(700, 550, 400);
  //Body.setAngularVelocity(orangePlanet, 0.01);
  orangePlanet1.isStatic = true;

  orangePlanet2 = Bodies.circle(1200, -750, 400);
  //Body.setAngularVelocity(orangePlanet, 0.01);
  orangePlanet2.isStatic = true;

  // add all of the bodies to the world
  World.add(engine.world, [orangePlanet1, orangePlanet2]);

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
    }
  }

  background(0);
  fill(128);
  drawSprite(orangePlanet1, orangePlanetImg1);
  drawSprite(orangePlanet2, orangePlanetImg1);
  drawSprite(rocketBody, rocketImg);
  // drawBody(greenPlanet);
}
