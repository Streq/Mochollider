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
	ent0,
	speed = 1;
var loop = new Mocho.loop.Loop(
	() => {
		//boundaries
		let closeIn = 10,
			thickness = 1,
			hw = canvas.width/2,
			hh = canvas.height/2;
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
		
		ent0 = world.createBox(
			{ type : 'dynamic'
			, w : 10
			, h : 10
			, x : hw - 10 - closeIn - 1
			, y : hh - 10 - closeIn - 1
			}
		);
		
		eventqueue = Mocho.input.makeEventQueue(canvas,["keydown"]);
	},
	(dt) => {
		eventqueue.processEvents((e)=>{
			switch(e.keyCode){
				case 81:
					world.destroyBox(ent0);
					ent0 = world.createBox({type : 'dynamic', w : 10, h : 10, x : 150, y : 150});					
					break;
			}
		});
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
