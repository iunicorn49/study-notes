const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

// 百度图片的src 有 url 和 basy64 两种模式, 需要分别处理
module.exports = async (src, dir) => {
  const isUrl = /\.(jpg|png|gif)$/.test(src)
  if (isUrl) {
    await urlToImg(src, dir)
  } else {
    await base64ToImg(src, dir)
  }
}

// url
const urlToImg = promisify((url, dir, cb) => { // 返回一个 promise , 可以用 async awite 来操作
  const mod = /^https:/.test(url) ? https : http // 根据前缀来判断是何种模式
  const ext = path.extname(url) // 获取图片拓展名
  const file = path.join(dir, `${Date.now()}${ext}`)
  mod.get(url, res => { // 发起get请求,直接访问
    res.pipe(fs.createWriteStream(file))
      .on('finish', () => {
        cb()
        console.log('url', file)
      })
  })
}) 

// base64 , 常见格式: data:image/jpeg;base64,...
const base64ToImg = async function (base64Str, dir) {
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
  try {
    const ext = matches[1].split('/')[1]
      .replace('jpeg', 'jpg') // 其他格式不管, 将jpeg换成jpg
    const file = path.join(dir, `${Date.now()}.${ext}`)
    await writeFile(file, matches[2], 'base64')
    console.log('base64', file)
  } catch(ex) {
    console.log('非法 base64 字符串')
  }
}