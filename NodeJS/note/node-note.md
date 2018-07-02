## 概念

###CPU密集 与 I/O密集 

- CPU密集: 压缩, 解压, 加密, 解密
- I/O密集: 文件操作, 网络操作, 数据库

### web常见场景

- 静态资源读取
- 数据库操作
- 渲染页面

### 高并发应对之道

- 增加机器数
- 增加每台机器的CPU数--多核

### 进程

- 进程: 计算机中的程序关于某数据合集上的一次运行活动, 是系统进行资源分配和调度的基本单位 .
- 多进程: 启动多个进程, 多个进程可以一块执行多个任务 .
- 线程: 进程内一个相对独立的, 可调度的执行单元, 与同属一个进程的线程共享进程的资源 .
- 多线程: 启动一个进程, 在一个进程内启动多个线程, 这样, 多个线程也可以执行多个任务 .

### NodeJS的单线程

- 单线程只是针对主进程, I/O操作系统底层多线程调度 .
- 单线程并不是单进程 .

##NodeJS

### CommonJS

> NodeJS的模块化规范 .

- 每个文件时一个模块, 都有自己的作用域 .

- 在模块内部, **module** 变量代表模块本身 .

- **module.exports** 属性代表模块对外的接口 .

- **module** 被加载的时候(通过 **require** 函数), 会被执行一次, 加载后缓存 .

- 一旦出现某个模块被循环加载, 就只输出已经执行的部分, 还未执行的部分不会输出 .

- **module.exports** 与 **exports** 的区别: 后者是前者的快捷方式, 绝大部分情况下是一个东西, 注意, 不要随便修改 **exports** 的指向 .

  ```javascript
  exports.something = 'something'
  module.exports.something = 'something'

  // 上面两句话是一样的

  exports = 'something' // 这个是错误的, 会导致找不到该模块
  module.exports = 'something' // 这个可以正常使用, 该模块就是 something
  ```

### global

> 全局对象, 对应, 浏览器的 window , 自带许多常用的 API .

- **global** 可以声明全局变量, `global.varName = something` , 如此做, 即便没有在模块中导出, 只要引入该模块, 也可以直接调用 .
- **setImmediate** 和 timeout 与 interal 差不多, 不过不需要传入时间, 在当前事件队列完成时调用, 这条命令, 将自己插入下一次事件队列的第一位 .

### process

> 进程 .

#### 常用API

```javascript
const {argv, argv0, execArgv, execPath, env } = process

argv.forEach(item => {
	console.log(item)
	// item === /usr/local/bin/node (node 所安装的路径)
	// item === /Users/zlk/个人/study-notes/NodeJS/demo/index.js (当前文件路径)
	// 当启动脚本时, 携带参数时, 参数也会被依次读取, 例如: node demo.js --test a=1 b=2
})

console.log('argv0: ', argv0) // 并没什么卵用

console.log('execArgv: ', execArgv) // 可以打印脚本之前的参数, 返回一个数组, 同 argv, 例如: node --inspect demo.js

console.log('execPath: ', execPath) // 该脚本路径

console.log('env: ', env) // 打印当前的执行环境, 各种配置项

console.log('cwd: ', process.cwd()) // 当前路径

process.nextTick(() => { // 在当前事件队列完成时调用, 优先级比 setImmediate 高, 因为, 这条命令, 将自己插入当前事件队列的最后一个
    console.log('nextTick')
})
```

## 常用 API

### path

> 路径相关 .

#### normalize

> 格式化路径, 常用于处理 `//` 和 `..` , 这些跟路径有关的容易写错的特殊符号 .

```javascript
const { normalize } = require('path')
let pathStr = '/usr//local//bin'
console.log(normalize(pathStr)) // /usr/local/bin
```

#### join

> 拼接路径, 会调用 **normalize** .

```javascript
const { join } = require('path')
console.log(join('/one', 'two', '//three')) // /one/two/three
console.log(join('/one', '../two', '//three')) // /two/three
```

#### resolve

> 相对路径解析成绝对路径 .

```javascript
const { resolve } = require('path')
console.log(resolve('./')) // /Users/zlk/个人/study-notes/NodeJS
```

#### basename  dirname  extname

> 文件名, 文件所在路径, 文件拓展名 .

```javascript
const { basename, dirname, extname } = require('path')
const filePath = '/usr/local/bin/readme.md'

console.log(basename(filePath)) // readme.md
console.log(dirname(filePath)) // /usr/local/bin
console.log(extname(filePath)) // .md
```

#### parse  format

> **parse** 解析文件名, 可以解析出文件名, 文件所在路径, 文件拓展名 , **format** 是前者的逆向操作 .

```javascript
const { parse, format } = require('path')
const filePath = '/usr/local/bin/readme.md'

let parseFile = parse(filePath)
let formatFile = format(parseFile)

console.log(parseFile)
// { root: '/',
//   dir: '/usr/local/bin',
//   base: 'readme.md',
//   ext: '.md',
//   name: 'readme' }

console.log(formatFile) // /usr/local/bin/readme.md
```

#### sep  delimiter  win32  posix

> 操作系统相关 .

```javascript
const { 
	sep, // 路径分隔符
	delimiter, // path的分隔符
	win32, // 直接查看 window操作系统下面的相关属性的值
	posix // 上面的一部分
} = require('path')

console.log('sep: ', sep)
console.log('delimiter: ', delimiter)
console.log('win32: ', win32)
```

#### __dirname

> 文件绝对路径 .

### Buffer

> 处理二进制数据流 .
>
> 实例类似整数数组, 大小固定 , 每一项都用16进制表示(不确定) .
>
> C++ 代码在 V8 堆外分配物理内存 .

#### alloc

> 创建一个 **Buffer** .

#### form

> 基于数组或字符串(默认基于utf-8), 创建一个 **Buffer** .

####byteLength

> 查看字符串占的字节数 .

```javascript
console.log('Buffer_英文: ', Buffer.byteLength('abc')) // 3
console.log('Buffer_中文: ', Buffer.byteLength('一二三')) // 9
```

####isBuffer

> 判断对象是否是 **Buffer** .

#### concat

> 拼接 **Buffer** , 传入一个数组, 数组的每一项都必须是 **Buffer对象** .

```javascript
const b1 = Buffer.from('Hello')
const b2 = Buffer.from(' ')
const b3 = Buffer.from('World')
const b4 = Buffer.from(' ')
const b5 = Buffer.from('!')

console.log(b1, b2, b3, b4, b5)
// <Buffer 48 65 6c 6c 6f> <Buffer 20> <Buffer 57 6f 72 6c 64> <Buffer 20> <Buffer 21>

let concatTest = Buffer.concat([b1, b2, b3, b4, b5])
console.log(concatTest.toString()) // Hello World !
```

#### length  toString  fill  equals  indexOf  copy

> 长度, 转字符串, 填充, 判断 buffer 里的内容是否相等, 同数组(找字符), copy

```javascript
const buf = Buffer.from('Hello')

/** length */
console.log(buf.length) // 5
const buf2 = Buffer.alloc(10)
console.log(buf2.length) // 10

/** toString */
console.log(buf.toString('base64')) // SGVsbG8=, 不传参数, 默认是 utf-8, 出来就是 Hello

/** fill */
const buf3 = Buffer.allocUnsafe(10)
console.log(buf3) // allocUnsafe 生成的 buffer , 内容是不确定的
console.log(buf3.fill(9))
// <Buffer 09 09 09 09 09 09 09 09 09 09>, 可以传入第二第三个参数, 代表从哪里开始填充, 至哪里结束

/** equals */
const e1 = Buffer.from('test')
const e2 = Buffer.from('test')
const e3 = Buffer.from('TEST')
console.log(e1.equals(e2)) // true
console.log(e1.equals(e3)) // false

/** indexOf lastIndexOf */
const I1 = Buffer.from('ABBC')
console.log(I1.indexOf('B')) // 1
console.log(I1.lastIndexOf('B')) // 2
console.log(I1.indexOf('D')) // -1
```

###events

```javascript
const EventEmitter = require('events')

class MyEvent extends EventEmitter {} // 首先继承node内置的events类

const ce = new MyEvent()

ce.on('test', () => { // 监听事件名
	console.log('test 触发')
})

setInterval(() => {
	ce.emit('test') // 触发事件
}, 2000)
```

#### new EventEmitter.on

> 注册监听器 .

#### new EventEmitter.emit

> 触发事件 .

#### new EventEmitter.once

> 只触发一次 .

####new EventEmitter.removeListener

> 移除事件 .

```javascript
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
	ce.removeListener('test', move) // 后续可以传入多个参数, 同时移除多个事件
}, 2001)
```

#### new EventEmitter.removeAllListeners

> 移除所有事件 .

```javascript
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
```

### fs

> 文件操作系统 .

#### readFile

> 异步读取文件 .	

| 参数     | 类型       | 备注                                       |
| ------ | -------- | ---------------------------------------- |
| 路径     | String   | 必填                                       |
| decode | String   | 选填, 默认直接返回 **Buffer** 对象, 可以选择 `utf-8` 等, 直接读取文件, 返回字符串 . |
| 回调函数   | Function | 必填, 参数: **err\|file** .                  |

#### fs.readFileSync

> 同步读取文件, 不需要传递回调函数 .

```javascript
const fs = require('fs')
const { join } = require('path')

let data = fs.readFileSync(join(__dirname, './files/hehe.js'), 'utf-8')

console.log(data)
```

#### fs.writeFile

> 写文件 .

| 参数   | 类型             | 备注                           |
| ---- | -------------- | ---------------------------- |
| 路径   | String         | 必填                           |
| 内容   | String\|Buffer | 必填, 写入的信息, 如果是Buffer会忽略配置项 . |
| 配置项  | Object\|String | 看文档吧 .                       |
| 回调函数 | Function       | 必填 .                         |

```javascript
const fs = require('fs')
const { join } = require('path')

const word = 'Hello world'

fs.writeFile(join(__dirname, './files/write.js'), word, {
	encoding: 'utf-8'
}, err => {
	if (err) throw err
	console.log('done')
})
```

#### fs.stat

>查看文件信息 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.stat(join(__dirname, './files/hehe.js'), (err, stat) => {
	if (err) throw err
	console.log(stat) // stat对象不只有这些信息, 还有其他方法和属性, 具体看文档 .
})
```

#### fs.rename

> 重命名 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.rename(join(__dirname, './files/write.js'), 'change.js', err => {
	if (err) throw err
	console.log('done')
})
// vscode 调试环境下, 会将文件移动到根目录 .
```

#### fs.unlink

> 删除文件 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.unlink(join(__dirname, './files/wtf.js'), err => {
	if (err) throw err
	console.log('done')
})
```

#### fs.readdir

> 查看文件夹 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.readdir(join(__dirname, './files/'), (err, files) => {
	if (err) throw err
	console.log(files) // 数组, 文件夹下所有的文件.
})
```

#### fs.mkdir

> 创建文件夹 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.mkdir(join(__dirname, './test'), err => {
	if (err) throw err
	console.log('done')
})
```

#### fs.rmdir

> 删除文件夹 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.rmdir(join(__dirname, './test'), err => {
	if (err) throw err
	console.log('done')
})
```

#### fs.watch

> 监听文件或文件夹的变动 .

```javascript
const fs = require('fs')
const { join } = require('path')

fs.watch(join(__dirname, './files/'), {
	recursive: true // 是否监视该文件夹下所有的文件夹
}, (eventType, filename) => {
	console.log(eventType)
	console.log(filename)
})
```

#### fs.createReadStream

> 通过流的方式读取 .

```javascript
const fs = require('fs')
const { join } = require('path')

const rs = fs.createReadStream(join(__dirname, './files/test.js')) // 以流对象的方式读取文件, 指定文件路径

rs.pipe(process.stdout) // 输出文件
```

#### fs.createWriteStream

> 通过流的方式写入, 只能写入 **Buffer** 或 **String** .

```javascript
const fs = require('fs')
const { join } = require('path')

const ws = fs.createWriteStream(join(__dirname, './files/test.js')) // 以流对象的方式写入文件, 指定文件路径

const tid = setInterval(() => {
	const num = parseInt(Math.random() * 10)
	console.log(num)
	if (num < 8) {
		ws.write(`${num}`) // 写入文件
	} else {
		clearInterval(tid)
		ws.end() // 停止写入
	}
}, 500)

ws.on('finish', () => { // finish 是 WriteStream 自己的事件, 监听文件是否写完 
	console.log('写完了')
})
```

## 技巧

### 解决回调地狱

#### promisify

> node内置的Promise工具 .

```javascript
const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const read = promisify(fs.readFile)

read(join(__dirname, './files/test.js')).then(file => {
	console.log(file)
}).catch(err => {
	throw err
})
```

#### async await

> 需要依赖node内置的Promise工具 以及 `try catch` 方法 .

```javascript
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
```

## 测试

###断言 - assert

> node 内置 assert 函数来做断言(也就是测试).
>
> 但是十分简陋, 市面上有断言库(chaijs)可以用.
>
> BDD: 行为驱动开发
>
> TDD: 测试驱动开发

chaijs网址: http://www.chaijs.com/

### 测试用例 - Mocha

> Mocha 是一个 js 的测试框架.

mochajs: https://mochajs.org/

### 测试覆盖率 - istanbul

istanbul: https://github.com/gotwarlost/istanbul

### 持续集成

慕课视频: https://coding.imooc.com/lesson/146.html#mid=7684