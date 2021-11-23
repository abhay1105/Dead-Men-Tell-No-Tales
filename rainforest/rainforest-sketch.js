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
const drawSprite = Helpers.drawSprite;

let cam;
let engine;
let world;
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
let rainforest_rotationNum = Math.PI/21
let rainforest_floatingBlocks = []
let rainforest_engine2 = false;
let rainforest_pirateImg;
let rainforest_hills = []

let rainforest_x = 200
let rainforest_y = 0

var rainforest_conditions = [];

class Conditions {
    constructor(checkFunction, onceDoneFunction) {
        this.check = checkFunction;
        this.onceDone = onceDoneFunction;
    }
}

function randomNumber(lowerBound, upperBound) {
    return Math.floor((Math.random() * upperBound) + lowerBound);
}

function preload(){
    rainforest_pirateImg = loadImage("./components/rainforest/pirateship.png")
}

function setup() {
    canvas = createCanvas(screen.availWidth, screen.availHeight - 110, WEBGL);
    engine = Engine.create();
    world = engine.world;
    cam = createCamera()
    let pi = Math.PI
    // conditions.push(
    //     new Conditions(
    //         () => {
    //             return ball.body.position.y >= 326;
    //         },
    //         () => {
    //             Body.applyForce(ball.body, ball.body.position, { x: 0, y: 0.0 });
    //         }
    //     )
    // );

    rainforest_ramp = Bodies.rectangle(rainforest_x + 1020, rainforest_y + 407, 600, 100, {isStatic: true})
    World.add(world, rainforest_ramp)

    rainforest_ball = new Ball(rainforest_x + -600, rainforest_y + 200, 30)
    rainforest_finalBall = Bodies.circle(rainforest_x + 6450, rainforest_y + 4500, 30)
    // finalBall = new Ball(5000, 4000, 30, {isStatic: true})
    World.add(world, rainforest_finalBall)
    rainforest_ground = Bodies.rectangle(rainforest_x + 0, height / 2 + 40, width, 100, { isStatic: true })
    World.add(world, rainforest_ground)

    rainforest_ground2 = Bodies.rectangle(rainforest_x + 2500, rainforest_y + 2500, 5500, 100, { isStatic: true })
    World.add(world, rainforest_ground2)

    rainforest_ground3 = Bodies.rectangle(rainforest_x + 6450, rainforest_y + 4600, 100, 100, {isStatic: true})
    World.add(world, rainforest_ground3)

    rainforest_pendulumBall = Bodies.circle(rainforest_x + 6300, rainforest_y + 4300, 50, {isStatic: false})
    rainforest_pendulumConstraint = Constraint.create({
        pointA: {x: rainforest_x + 6300, y: rainforest_y + 4100},
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
    for(var i = 0; i < rainforest_floatingBlocks.length; i++){

    }
    World.add(world, rainforest_floatingBlocks)
    // boxes.push(new TreeTrunk(700, 250, 30, 220))
    // circles.push(new TreeTop(700, 65, 75))

    // boxes.push(new TreeTrunk(1200, 250, 30, 220))
    // circles.push(new TreeTop(1200, 65, 75))

    // boxes.push(new TreeTrunk(1500, 250, 30, 220))
    // circles.push(new TreeTop(1500, 65, 75))

    rainforest_dropVertices = [
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

    rainforest_drop = Bodies.fromVertices(rainforest_x + 5600, rainforest_y + 4200, rainforest_dropVertices, { isStatic: true, friction: 0, restitution: 1 }, [flagInternal=false], [removeCollinear=0.01], [minimumArea=10], [removeDuplicatePoints=0.01]);

    World.add(world, rainforest_drop)


    rainforest_car = Composites.car(rainforest_x + -600, rainforest_y + 300, 200, 40, 40);
    World.add(world, rainforest_car)

    rainforest_trigger = Bodies.rectangle(rainforest_x + 5350, rainforest_y + 2500, 200, 100, {isStatic: true})
    World.add(world, rainforest_trigger)


    let ice_curve_vertices = []

    let num = 30
    let change = (2 * pi) / num

    for (var i = 0; i < (2 * pi); i += change) {
        x = i;
        y = Math.sin(i + (3 * pi / 2)) + 1

        console.log(200 * x, -1000 * y)

        ice_curve_vertices.push({ x: 200 * x, y: -400 * y })
    }

    console.log(ice_curve_vertices)

    // ice_curve = Bodies.fromVertices(2500, 2375, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);

    // ice_curve2 = Bodies.fromVertices(3200, 2375, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]);

    rainforest_hills.push(Bodies.fromVertices(rainforest_x + 3000, rainforest_y + 2200, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]), Bodies.fromVertices(rainforest_x + 4300, rainforest_y + 2200, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]), Bodies.fromVertices(rainforest_x + 1800, rainforest_y + 2200, ice_curve_vertices, { isStatic: true, friction: 0 }, [flagInternal = false], [removeCollinear = 0.01], [minimumArea = 10], [removeDuplicatePoints = 0.01]))

    World.add(world, rainforest_hills)

    // ice_curve = Bodies.rectangle(0, 0, 200, 100, {chamfer: {radius: 50}})
    // World.add(world, ice_curve)
    // World.add(world, ice_curve2)
    console.log(rainforest_ball)
    console.log(rainforest_car)

    // Body.applyForce(ball.body, ball.body.position, {x: 0.5, y: 0})


    rainforest_conditions.push(
        new Conditions(
            () => {
                return Matter.SAT.collides(rainforest_ball.body, rainforest_car.bodies[0]).collided;
            },
            () => {
                console.log("ADDED CONSTRAINT")
    
                if(!rainforest_constrainOnce){
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
        new Conditions(
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
        new Conditions(
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
        new Conditions(
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
        new Conditions(
            () => {
                return Matter.SAT.collides(rainforest_car.bodies[1], rainforest_trigger).collided;
            },
            () => {
                console.log("ADDED CONSTRAINT2")
    
                World.remove(world, rainforest_trigger)
                rainforest_showTrigger = false;
                rainforest_startEngine = false;
                rainforest_rotationNum = Math.PI
                Body.applyForce(rainforest_car.bodies[1], rainforest_car.bodies[1].position, {x: 0, y: 0.5})
            }
        )
    )

    rainforest_conditions.push(
        new Conditions(
            () => {
                return Matter.SAT.collides(rainforest_finalBall, rainforest_pendulumBall).collided;
            },
            () => {
                console.log("ADDED CONSTRAINT2")
    
                Body.applyForce(rainforest_finalBall, rainforest_finalBall.position, {x: 0.2, y: 0})
            }
        )
    )
}



function moveCam(mainBody) {
    cam.setPosition(mainBody.body.position.x + 200, mainBody.body.position.y - 100, 500)
}

function diffMoveCam(x, y, zoom){
    cam.setPosition(x, y, zoom)
}

function draw() {
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
    Engine.update(engine);
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
    if(rainforest_showTrigger){
        drawBody(rainforest_trigger)

    }

    if(!rainforest_rampRemoved){
        drawBody(rainforest_ramp)
    }

    drawBody(rainforest_drop)

    if(rainforest_engine2){
        Body.setVelocity(car.bodies[2], rainforest_rotationNum)
    }

    if(rainforest_startEngine){
        console.log("ENGINE STARTING")
        Body.setVelocity(rainforest_car.bodies[0], {x: 5, y: 0})
    }

    if(rainforest_startRotation){
        Body.setAngularVelocity(rainforest_car.bodies[1], rainforest_rotationNum)
    }

    if(rainforest_showTrigger){
        moveCam(rainforest_ball)
    }else{
        diffMoveCam(rainforest_x + 5500, rainforest_y + 4200, 1000)
    }

    for(let i = 0; i < rainforest_hills.length; i++){
        drawBody(rainforest_hills[i])
    }

    stroke(255)
    line(rainforest_x + 6300, rainforest_y + 4100, rainforest_pendulumBall.position.x, rainforest_pendulumBall.position.y)


    // moveCam(ball)

}