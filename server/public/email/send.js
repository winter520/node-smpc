const path = require('path').resolve('.')
const pathLink = path
const nodemailer = require('nodemailer')
const email = require(pathLink + '/config/email')
// 创建一个SMTP客户端配置
// const config = {
//   host: 'smtp.qq.com', 
//   port: 25,
//   auth: {
//     user: '2624376436@qq.com', //刚才注册的邮箱账号
//     pass: 'pzbnhhctkrmodjaj'  //邮箱的授权码，不是注册时的密码
//   }
// }

// 创建一个SMTP客户端对象
// const transporter = nodemailer.createTransport(email);

function sendMail (mail, params) {
  // console.log(email[params])
  // 创建一个SMTP客户端对象
  const transporter = nodemailer.createTransport(email[params]);
  return new Promise(resolve=>  {
    transporter.sendMail(mail, function(error, info){
      if(error) {
        resolve({
          msg: 'Error',
          error: error
        })
      } else {
        resolve({
          msg: 'Success',
          error: info.response
        })
      }
      // console.log('mail sent:', info.response);
    })
  })
}
module.exports = sendMail
// 发送邮件
// module.exports = function (mail){
//   return new Promise(resolve=>  {
//     transporter.sendMail(mail, function(error, info){
//       if(error) {
//         resolve({
//           msg: 'Error',
//           error: error
//         })
//       } else {
//         resolve({
//           msg: 'Success',
//           error: info.response
//         })
//       }
//       // console.log('mail sent:', info.response);
//     })
//   })
// }