class IceParticlePlinko {
    constructor(x, y, r, rgb) {
        var options = {
            restitution: 0.5,
            friction: 0,
            density: 0.01
        }
        this.rgb = rgb;
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }
    show() {
        fill(this.rgb);
        stroke(this.rgb);
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}

