"use strict";
var mod = module.exports;

class Queue{
	constructor(){
		this.array=[];
	}
	
	enqueue(el){
		this.array.push(el);
	}
	
	dequeue(){
		return this.array.shift();
	}
	
	isEmpty(){
		return this.array.length == 0;
	}
	
	length(){
		return this.array.length;
	}	
}

class DBufferQueue {
	constructor(){
		this.first = new Queue();
		this.second = new Queue();
		this.inqueue = this.first;
		this.outqueue = this.second;
	}
	
	enqueue(el){
		this.inqueue.enqueue(el);
	}
	
	dequeue(){
		return this.outqueue.dequeue();
	}
	
	swapBuffer(){
		let aux = this.inqueue;
		this.inqueue = this.outqueue;
		this.outqueue = aux;
	}
	
	isEmpty(){
		return this.outqueue.isEmpty();
	}	
}
mod.Queue = Queue;
mod.DBufferQueue = DBufferQueue;
