/**
* Creates a composite with a Newton's Cradle setup of bodies and constraints.
* @method newtonsCradle
* @param {number} xx
* @param {number} yy
* @param {number} number
* @param {number} size
* @param {number} length
* @return {composite} A new composite newtonsCradle body
*/
function createNewtonsCradle(xx, yy, number, size, length) {
    var Composite = Matter.Composite,
        Constraint = Matter.Constraint,
        Bodies = Matter.Bodies;

    var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

    for (var i = 0; i < number; i++) {
        // var spacing = 300;
        var spacing = 0;
        var separation = 1.9,
            circle = Bodies.circle(xx + i * (size * separation) + i*spacing, yy + length, size, 
                { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 1 }),
            constraint = Constraint.create({ pointA: { x: xx + i * (size * separation) + i*spacing, y: yy }, bodyB: circle });

        Composite.addBody(newtonsCradle, circle);
        Composite.addConstraint(newtonsCradle, constraint);
    }

    return newtonsCradle;
};
