const puppeteer = require('puppeteer')
const { screenshot } = require('./config/default')

;(async () => { // 这是一个截屏函数 ? 记得在前面加 ';' 不然会报错, 语法问题
  const browser = await puppeteer.launch() // 搞一个浏览器对象 ?
  const page = await browser.newPage() // 打开一个新的网页
  await page.goto('https://baidu.com') // 网页地址 ?
  await page.screenshot({path:`${screenshot}/${Date.now()}.png`}) // 存放地址

  await browser.close() // 关闭
})()