let absoluteScreenWidth = screen.availWidth;
let absoluteScreenHeight = screen.availHeight;

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

function setup() {
  createCanvas(absoluteScreenWidth, absoluteScreenHeight);
}

function draw() {
  background(0);
}
