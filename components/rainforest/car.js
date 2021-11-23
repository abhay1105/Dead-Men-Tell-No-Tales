class Car{
    constructor(x, y, w, h) {
        this.body = Composites.car(190, 100, 100, 45, 30);
        console.log(this.body)
        this.w = w;
        this.h = h;
        World.add(world, this.body)
    }

    show() {
        let pos = this.body.bodies[0].position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        fill(127);
        pop();
    }
}