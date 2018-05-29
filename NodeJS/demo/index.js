const EventEmitter = require('events')

class MyEvent extends EventEmitter {}

const ce = new MyEvent()

function action () {
	console.log('action')
}

function move () {
	console.log('move')
}

ce.on('test', action)
ce.on('test', move)

setInterval(() => {
	ce.emit('test')
}, 1000)

setTimeout(() => {
	ce.removeAllListeners('test')
}, 3001)