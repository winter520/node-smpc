let host = {
  qq: 'smtp.qq.com',
  '163': 'smtp.163.com'
}

module.exports = {
  host: 'smtp.163.com', 
  // host: '220.181.72.147',
  // host: 'smtp.mxhichina.com', 
  // port: 25,
  port: 465,
  secureConnection: true,
  // secure:false,
  auth: {
    user: 'fusion15627@163.com', //刚才注册的邮箱账号
    pass: 'ISEZPUGXMMYDCPOS'  //邮箱的授权码，不是注册时的密码
  }
}