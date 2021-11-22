/**
* Creates a simple cloth like object.
* @method cloth
* @param {number} xx
* @param {number} yy
* @param {number} columns
* @param {number} rows
* @param {number} columnGap
* @param {number} rowGap
* @param {boolean} crossBrace
* @param {number} particleRadius
* @param {} particleOptions
* @param {} constraintOptions
* @return {composite} A new composite cloth
*/
function createCloth(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composites = Matter.Composites;

    var group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } }, constraintOptions);

    var cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};
