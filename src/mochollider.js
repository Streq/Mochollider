"use strict";
var Mocho = {
    collision:require("./Mocho/modules/mocho.collision")
};

class World{
    constructor(){
        this.staticEntities = [];
        this.dynamicEntities = [];
    }
    show(ctx,canvas){
        let i,e;
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#FFFFFF";
        for(i in this.staticEntities){
            e = this.staticEntities[i];
            ctx.fillRect(e.x,e.y,e.w,e.h);
        }
        ctx.fillStyle="#0000FF";
        for(i in this.staticEntities){
            e = this.staticEntities[i];
            ctx.fillRect(e.x+1,e.y+1,e.w-2,e.h-2);
        }
        ctx.fillStyle="#00FF00";
        for(i in this.dynamicEntities){
            e = this.dynamicEntities[i];
            ctx.fillRect(e.x,e.y,e.w,e.h);
        }
        ctx.strokeStyle="#FF00FF";
        for(i in this.dynamicEntities){
            e = this.dynamicEntities[i];
            ctx.beginPath();
            ctx.moveTo(e.x+e.w/2,e.y+e.h/2);
            ctx.lineTo(e.x+e.w/2+e.vx*1000,e.y+e.h/2+e.vy*1000);
            ctx.closePath();
            ctx.stroke();
        }
        
    }
    update(dt){
        this.moveDynamicEntities(dt);
        //this.solveDynamicCollisions(dt);
    }

    
    moveDynamicEntities(dt){
        let i;
        for(i in this.dynamicEntities){
            this.moveDynamicEntity(this.dynamicEntities[i], dt);
        }
    }

    moveDynamicEntity(e,dt){
        let auxdt = dt;
        while(auxdt){
            auxdt = this.dynamicEntityStep(e, auxdt);
        }
    }

    dynamicEntityStep(e,dt){
        let dx = e.vx*dt,
            dy = e.vy*dt,
            ent = null;
        ent = this.findFirstObstacle(e.x, e.y, e.w, e.h, dx, dy);
        if(ent){
            dt = this.solveDynamicStaticCollision(e, ent, dt);
        }else{
            e.x += dx;
            e.y += dy;
            dt = 0;
        }
        return dt;
    }

    solveDynamicStaticCollision(e,e1,dt){
        let lambda = 1,
            sideOfCol,
            dx = e.vx*dt,
            dy = e.vy*dt;

        sideOfCol = Mocho.collision.boxBoxSideOfCollision(
            e.x, e.y, e.w, e.h,
            e1.x, e1.y, e1.w, e1.h,
            dx,dy
        );
        if(sideOfCol.x){
            let oldx = e.x;
            //fix velocity
            e.vx = 0;
            //fix position
            e.x = (sideOfCol.x > 0)?
                (e1.x - e.w):
                (e1.x + e1.w);
            lambda = (e.x-oldx)/dx;
            e.y += dy*lambda;
        }else{
            let oldy = e.y;
            //fix velocity
            e.vy = 0;
            //fix position
            e.y = (sideOfCol.y > 0)?
                (e1.y - e.h):
                (e1.y + e1.h);
            lambda = (e.y-oldy)/dy;
            e.x += dx*lambda;
        }
        return dt*(1-lambda);
    }

    findFirstObstacle(x,y,h,w,dx,dy){
        let j,
            ent = null,
            lambda = 1;
        for(j in this.staticEntities){
            let e1 = this.staticEntities[j];
            //if there is a collision
            if(Mocho.collision.boxBoxMoving(
                x, y, w, h,
                e1.x, e1.y, e1.w, e1.h,
                dx, dy))
            {
                let isCloser,
                auxLambda;
                auxLambda = Mocho.collision.boxBoxMovingLambda(
                    x, y, w, h,
                    e1.x, e1.y, e1.w, e1.h,
                    dx, dy
                );
                isCloser = auxLambda < lambda || 
                    (
                        auxLambda == lambda && 
                        (
                            Mocho.collision.rangeRange(x, w, e1.x, e1.w) ||
                            Mocho.collision.rangeRange(y, h, e1.y, e1.h)
                        )
                    );
                if(isCloser){
                    lambda = auxLambda;
                    ent = e1;
                };
            }
        }
        return ent;
    }
}
class StaticEntity{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class DynamicEntity{
    constructor(x,y,w,h,vx,vy){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.bounce = 0;
        this.slide = 1;
    }
}

exports.World = World;
exports.DynamicEntity = DynamicEntity;
exports.StaticEntity = StaticEntity;