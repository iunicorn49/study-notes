const {add, errorAdd, mul} = require('../src/math')

const assert = require('assert')

assert.equal(add(2, 3), 5) // 没有任何信息则说明成功

assert.equal(errorAdd(2, 3), 5) // 这里就会报错