class TreeTop {
    constructor(x, y, r) {
        var options = {
            restitution: 1,
            friction: 0,
            isStatic: true
        };
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }
    show() {
        strokeWeight(1);
      stroke(255);
        fill(127);
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}