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
	ent, ent0,
	left=false,
	down=false,
	up=false,
	right=false;
var loop = new Mocho.loop.Loop(
	() => {
		//boundaries
		let closeIn = 10,
			thickness = 1,
			hw = canvas.width/2,
			hh = canvas.height/2;
		world.createBox(
			{ type : 'static'
			, w : canvas.width - closeIn*2
			, h : thickness
			, x : -hw + closeIn
			, y : -hh + closeIn
			}
		);
		world.createBox(
			{type : 'static'
			, w : thickness
			, h : canvas.height - closeIn*2
			, x : -hw + closeIn
			, y : -hh + closeIn
			}
		);
		world.createBox(
			{ type : 'static'
			, w : canvas.width-closeIn*2
			, h : thickness
			, x : -hw + closeIn
			, y : +hh - thickness - closeIn
			}
		);
		world.createBox(
			{ type : 'static'
			, w : thickness
			, h : canvas.height - closeIn*2
			, x : +hw - thickness - closeIn
			, y : -hh + closeIn
			}
		);
		
		ent = world.createBox({type : 'dynamic', w : 10, h : 10, x : hw - 10 - closeIn - 1, y : hh - 10 - closeIn - 1});
		
		ent0 = world.createBox({type : 'dynamic', w : 10, h : 10, x : hw - 10 - closeIn - 1, y : hh - 10 - closeIn - 1});
		
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
				case 81:
					if(press){
						world.destroyBox(ent);
						world.destroyBox(ent0);
						ent = world.createBox({type : 'dynamic', w : 10, h : 10, x : 150, y : 150});
						ent0 = world.createBox({type : 'dynamic', w : 10, h : 10, x : 150, y : 150});
						
					}
					break;
			}
		});
		let speed = 1;
		let h = +right -left;
		let v = +down -up
		if(h&&v){
			h *= Math.SQRT1_2;
			v *= Math.SQRT1_2;
		}
		ent.vx = speed*h;
		ent.vy = speed*v;
		ent0.vx = speed;
		ent0.vy = speed;
		
		world.update(dt);
	},
	() => world.show(ctx,canvas),
	60,
	false
);
loop.timeFactor = 1;
loop.run();
