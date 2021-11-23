class Ground {
    constructor(x, y, w, h){
        var options = {
            isStatic: true,
        }
        this.body = Bodies.rectangle(190, 100, 100, 45, 30, options);
        console.log(this.body)
        this.w = w;
        this.h = h;
        this.x = x
        this.y = y
        World.add(world, this.body)
    }
    show  () {
        var pos = this.body.position;
        var angle = this.body.angle;
    
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        rect(0, 0, this.w, this.h);
        stroke(255);
        // translate(-this.w/2, -this.h/2); // Is you want to move the text at the top left corner
        fill(255);
        stroke(255);
        pop();
    };
}