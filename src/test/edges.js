"use strict";
var Mocho = require("../Mocho");
var Physics = require("../mochollider");
var Ph = Physics;

var canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
canvas.tabIndex = 1;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");


var world = new Ph.World();
var eventqueue,
	ent,
	left=false,
	down=false,
	up=false,
	right=false;
var loop = new Mocho.loop.Loop(
	() => {
		world.createBox({type : 'static', w : 20, h : 20, x : 0, y : 60});
		world.createBox({type : 'static', w : 20, h : 20, x : 20, y : 60});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 20, y : 80, vx : -0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 10, y : 80, vx : 0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 20, y : 50, vx : -0.03, vy : 0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 10, y : 50, vx : 0.03, vy : 0.03});
		
		world.createBox({type : 'static', w : 20, h : 20, x : 80, y : 60});
		world.createBox({type : 'static', w : 20, h : 20, x : 60, y : 60});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 80, y : 80, vx : -0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 70, y : 80, vx : 0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 80, y : 50, vx : -0.03, vy : 0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 70, y : 50, vx : 0.03, vy : 0.03});
		
		world.createBox({type : 'static', w : 20, h : 20, x : 40, y : 20});
		world.createBox({type : 'static', w : 20, h : 20, x : 40, y : 40});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 60, y : 40, vx : -0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 60, y : 30, vx : -0.03, vy : 0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 30, y : 40, vx : 0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 30, y : 30, vx : 0.03, vy : 0.03});
		
		world.createBox({type : 'static', w : 20, h : 20, x : 40, y : 100});
		world.createBox({type : 'static', w : 20, h : 20, x : 40, y : 80});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 60, y : 100, vx : -0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 60, y : 90, vx : -0.03, vy : 0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 30, y : 100, vx : 0.03, vy : -0.03});
		world.createBox({type : 'dynamic', w : 10, h : 10, x : 30, y : 90, vx : 0.03, vy : 0.03});
		
		ent = world.createBox({type : 'dynamic', w : 10, h : 10, x : 150, y : 150});
		eventqueue = Mocho.input.makeEventQueue(canvas,["keydown","keyup"]);
	},
	(dt) => {
		eventqueue.processEvents((e)=>{
			let press = (e.type === "keydown");
			switch(e.keyCode){
				case 87:
					up = press;
					break;
				case 83:
					down = press;
					break;
				case 68:
					right = press;
					break;
				case 65:
					left = press;
					break;
			}
		});
		let h = +right -left;
		let v = +down -up
		if(h&&v){
			h *= Math.SQRT1_2;
			v *= Math.SQRT1_2;
		}
		ent.vx = 1*h;
		ent.vy = 1*v;

		world.update(dt);
	},
	() => world.show(ctx,canvas),
	60,
	false
);
loop.timeFactor = 1;
loop.run();
