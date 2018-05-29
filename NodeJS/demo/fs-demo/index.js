const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const read = promisify(fs.readFile)

async function fn() {
	try {
		const file = await read(join(__dirname, './files/test.js'))
		console.log(file.toString())
	} catch(err) {
		throw err
	}
}

fn()