// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Plinko
// Video 1: https://youtu.be/KakpnfDv_f0
// Video 2: https://youtu.be/6s4MJcUyaUE
// Video 3: https://youtu.be/jN-sW-SxNzk
// Video 4: https://youtu.be/CdBXmsrkaPs
const Vector = Matter.Vector;
class Plinko {
  constructor(x, y, r, color, world) {
    var options = {
      restitution: 1,
      friction: 0,
      isStatic: true,
    };
    this.body = Bodies.circle(x, y, r, options);
    this.body.label = "plinko";
    this.r = r;
    this.color = color;
    World.add(world, this.body);
  }
  show() {
    noStroke();
    fill(this.color);
    var pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}
