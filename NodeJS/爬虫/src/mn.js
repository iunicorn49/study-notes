const puppeteer = require('puppeteer')
const { mn } = require('./config/default')
const srcToImg = require('./helper/srcToImg')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://image.baidu.com/')
  console.log('go to https://image.baidu.com/')
  await page.setViewport({ // 更改浏览器视口, 可以获取更多的内容
    width: 1920,
    height: 1080
  })
  console.log('reset viewport')
  // 模拟用户行为
  await page.focus('#kw') // 获取输入框,并且聚焦 百度图片的输入框Id是 kw
  await page.keyboard.sendCharacter('口袋妖怪') // 模拟输入
  await page.click('.s_search') // 模拟点击 百度图片的搜索按钮的class是 kw
  console.log('go to search list')
  // 等待加载完成
  page.on('load', async () => {
    console.log('page loading done, start fetch...')
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img')
      return Array.prototype.map.call(images, img => img.src)
    })
    srcs.forEach(async src => {
      await page.waitFor(200) // 增加请求间隔
      await srcToImg(src, mn)
    })
    await browser.close()
  })
})()