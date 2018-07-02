module.exports = {
  add: (...args) => {
    return args.reduce((prev, curr) => {
      return prev + curr
    })
  },

  errorAdd: (...args) => { // 这里故意写错, 用来测试断言
    return args.reduce((prev, curr) => {
      return prev + curr + 1
    })
  },

  mul: (...args) => {
    return args.reduce((prev, curr) => {
      return prev * curr
    })
  }
}