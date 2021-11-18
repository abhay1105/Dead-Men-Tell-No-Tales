class Ball {
    constructor(x, y, r) {
        var options = {
            restitution: 0.5,
            friction: 0,
            density: 1
        };
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }
    show() {
        fill(255, 255, 255);
        noStroke();
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}

