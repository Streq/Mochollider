"use strict";
var structs = require("./mocho.structs");

var mod = module.exports

class EventQueue extends structs.DBufferQueue {
    constructor(){
        super();
    }

    /**
     * Process all current events, events listened to while processing the queue will be
     * processed the next time this function is called
     * @function
     * @param {function(Event)} processor - function that processes the events
     */
    processEvents(processor){
        this.swapBuffer();
        while(!this.isEmpty()){
            processor(this.dequeue());
        }
    }

    /**
     * Listen to element
     * @function
     * @param {Element} element - the element events will be relative to,
     * @param {String} types - event type that will be listened to.
     * @param {function(Event)} [filter] - filter function that filters and/or transforms events,
     *        it must return null or undefined if the event is filtered out, the transformed value otherwise.
     */
    listen(element, type, filter){
        let queue = this;
        element.addEventListener(type,function(ev){
            let transformed = filter? filter(ev) : ev;
            if(transformed!=null){
                queue.enqueue(transformed);
            }
        });
    }
}


/**
 * EventListenerQueue Factory
 * @function
 * @param {Element} [element] - the element events will be relative to,
 * @param {String[]} [types] - event types that will be listened to.
 * @param {function(Event)} [filter] - filter function that filters and/or transforms events,
 *        it must return null or undefined if the event is filtered out, the transformed value otherwise.
 */
function makeEventListenerQueue(element, types, filter){
    var queue = new EventQueue();
    
    if(types != null){
        types.forEach(function(type){
            queue.listen(element, type, filter);
        });
    }
    return queue;
}



var preventDefaultArrowKeys = (event) => {
    switch(event.keyCode){
        case 37:
        case 38:
        case 39:
        case 40:
            event.view.event.preventDefault();
    }  
};

function avoidArrowKeyScroll(element){
    element.addEventListener("keydown", preventDefaultArrowKeys)
}

function allowArrowKeyScroll(element){
    element.removeEventListener("keydown", preventDefaultArrowKeys);
}

mod.makeEventQueue = makeEventListenerQueue;
mod.avoidArrowKeyScroll = avoidArrowKeyScroll;
mod.allowArrowKeyScroll = allowArrowKeyScroll;
mod.EventQueue = EventQueue;