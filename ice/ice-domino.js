class IceDomino {
    constructor(x, y, w, h, rgb) {
        var options = {
            frictionAir: 0.005,
            density: 0.01
        }
        this.rgb = rgb;
        this.w = w;
        this.h = h;
        this.body = Bodies.rectangle(x, y, w, h, options);
        World.add(world, this.body);
    }
    show() {
        fill(this.rgb);
        rectMode(CENTER);
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

