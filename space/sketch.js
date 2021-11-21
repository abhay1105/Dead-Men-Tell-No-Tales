// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Plinko
// Video 1: https://youtu.be/KakpnfDv_f0
// Video 2: https://youtu.be/6s4MJcUyaUE
// Video 3: https://youtu.be/jN-sW-SxNzk
// Video 4: https://youtu.be/CdBXmsrkaPs

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var particles = [];
var plinkos = [];
var bounds = [];
var funnels = [];
var cols = 11;
var rows = 10;


function setup() {
    createCanvas(600, 700);
    colorMode(HSB);
    engine = Engine.create();
    world = engine.world;
    //world.gravity.y = 2;

    funnels.push(new Funnel(500, 300, 10, height,PI/7));
    funnels.push(new Funnel(100, 300, 10, height,PI/-7));

    for(var i = 1; i < 12; i++){
        plinkos.push(new Plinko((i*50), 100, 10))
    }

    for(var i = 1; i < 11; i++){
        let push = 30
        plinkos.push(new Plinko((i*50) + push, 150, 10))
    }

    for(var i = 1; i < 10; i++){
        let push = 50
        plinkos.push(new Plinko((i*50) + push, 200, 10))
    }

    for(var i = 1; i < 9; i++){
        let push = 80
        plinkos.push(new Plinko((i*50) + push, 250, 10))
    }
 
    for(var i = 1; i < 8; i++){
        let push = 100
        plinkos.push(new Plinko((i*50) + push, 300, 10))
    }
    
    for(var i = 1; i < 7; i++){
        let push = 130
        plinkos.push(new Plinko((i*50) + push, 350, 10))
    }

    for(var i = 1; i < 6; i++){
        let push = 160
        plinkos.push(new Plinko((i*50) + push, 400, 10))
    }

    for(var i = 1; i < 5; i++){
        let push = 180
        plinkos.push(new Plinko((i*50) + push, 450, 10))
    }

    for(var i = 1; i < 4; i++){
        let push = 200
        plinkos.push(new Plinko((i*50) + push, 500, 10))
    }

    for(var i = 1; i < 3; i++){
        let push = 225
        plinkos.push(new Plinko((i*50) + push, 550, 10))
    }

    let mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio = pixelDensity() // for retina displays etc
    let options = {
        mouse: mouse
    }
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);

}

function getY(j) {
    if(j == 12){
        return 100
    }else if(j == 11){
        return 150
    }else if(j == 10){
        return 200
    }else if(j == 9){
        return 250
    }else if(j == 8){
        return 300
    }else{
        return 350
    }
}

function newParticle(x, y) {
    var p = new Particle(x, y, 10);
    particles.push(p);
}

function draw() {
    background(0, 0, 0);
    //   if (frameCount % 20 == 0) {
    //     newParticle();
    //   }
    Engine.update(engine, 1000 / 30);
    for (var i = 0; i < particles.length; i++) {
        particles[i].show();
        if (particles[i].isOffScreen()) {
            World.remove(world, particles[i].body);
            particles.splice(i, 1);
            i--;
        }
    }
    for (var i = 0; i < plinkos.length; i++) {
        plinkos[i].show();
    }
    for (var i = 0; i < bounds.length; i++) {
        bounds[i].show();
    }
    for(var i = 0; i < funnels.length; i++){
        funnels[i].show()
    }
}


function mouseDragged() {
    if(mouseX > 0 && mouseX < 700 && mouseY < 50){
        newParticle(mouseX, mouseY)

    }
}
