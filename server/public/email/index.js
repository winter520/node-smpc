const path = require('path').resolve('.')
const pathLink = path
const send = require(pathLink + '/server/public/email/send')

var mail = {
  // 发件人
  from: '2624376436@qq.com',
  // 主题
  subject: '测试',
  // 收件人
  to: '1562762537@qq.com',
  // 邮件内容，HTML格式
  text: '点击激活：xxx' //接收激活请求的链接
}
send(mail)