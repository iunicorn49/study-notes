const path = require('path')

module.exports = {
  entry: { // 入口
    index: './src/index.js'
  },
  output: { // 出口
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: { // 模块配置
    rules: [ // 配置 loader, 解析器等
      {
        test: /\.js$/, // 通过正则来判断文件, 这里是解析js文件
        include: [ // 需要解析的文件的路径, 可以配置多个路径
          path.resolve(__dirname, 'src/js') // 这边配置的是目标文件夹下的所有文件
        ],
        // loader: 'babel-loader', // 设置解析器, 需要npm下载好, 具体loader看文档, 只使用一个简单的loader的时候,直接用loader就可以了,不需要用use
        use: { // 这种方法也可以配置loader, 而且可以深度配置插件
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.less$/, // 多个 loader 由下至上执行, 这里处理less文件
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, 
          {
            loader: "css-loader" // translates CSS into CommonJS
          }, 
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      }
    ]
  }
}