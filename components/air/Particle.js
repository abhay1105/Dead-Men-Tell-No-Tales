function Particle(x, y, r) {
    this.body = Bodies.circle(x, y, r);
    console.log(this.body);
    this.r = r;
    World.add(world, this.body);
}

Particle.prototype.show = function() {
    fill(255);
    stroke(255);
    Engine.update(engine);
    var pos = this.body.position;
    translate(pos.x, pos.y);
    ellipse(0, 0, this.r*2);
}