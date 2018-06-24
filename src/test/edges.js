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
        world.staticEntities.push(new Ph.StaticEntity(0,60,20,20));
        world.staticEntities.push(new Ph.StaticEntity(20,60,20,20));
        world.dynamicEntities.push(new Ph.DynamicEntity(20,80,10,10,-0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(10,80,10,10,0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(20,50,10,10,-0.03,0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(10,50,10,10,0.03,0.03));
        
        world.staticEntities.push(new Ph.StaticEntity(80,60,20,20));
        world.staticEntities.push(new Ph.StaticEntity(60,60,20,20));
        world.dynamicEntities.push(new Ph.DynamicEntity(80,80,10,10,-0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(70,80,10,10,0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(80,50,10,10,-0.03,0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(70,50,10,10,0.03,0.03));
        
        world.staticEntities.push(new Ph.StaticEntity(40,20,20,20));
        world.staticEntities.push(new Ph.StaticEntity(40,40,20,20));
        world.dynamicEntities.push(new Ph.DynamicEntity(60,40,10,10,-0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(60,30,10,10,-0.03,0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(30,40,10,10,0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(30,30,10,10,0.03,0.03));
        
        world.staticEntities.push(new Ph.StaticEntity(40,100,20,20));
        world.staticEntities.push(new Ph.StaticEntity(40,80,20,20));
        world.dynamicEntities.push(new Ph.DynamicEntity(60,100,10,10,-0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(60,90,10,10,-0.03,0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(30,100,10,10,0.03,-0.03));
        world.dynamicEntities.push(new Ph.DynamicEntity(30,90,10,10,0.03,0.03));
        
        ent = new Ph.DynamicEntity(150,150,10,10,0,0);
        world.dynamicEntities.push(ent);
        
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
        