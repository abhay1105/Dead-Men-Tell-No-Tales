class IceParticlePeg {
  constructor(x, y, r) {
      var options = {
          friction: 0,
          isStatic: true
      }
      this.body = Bodies.circle(x, y, r, options);
      this.r = r;
      this.img = loadImage("resources/bird.png");
      World.add(world, this.body);
  }
  show() {
      ellipseMode(CENTER);
      fill(255);
      stroke(255);
      var pos = this.body.position;
      push();
      translate(pos.x, pos.y);
      // ellipse(0, 0, this.r * 2);  
      imageMode(CENTER);
      image(this.img, -this.r, -this.r, this.r*2, this.r*2);
      pop();
  }
}