module.exports = {
  // 用户名正则，4到16位（字母，数字，下划线）
  username: /^[a-zA-Z0-9_]{6,16}$/,
  // 邮箱正则
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
}