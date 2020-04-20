const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'UserInfo')
const mongoose = require('mongoose')
const async = require('async')

const UserInfo = mongoose.model('UserInfo')
const encryption = require(pathLink + '/server/public/methods/encryption')

const email = require(pathLink + '/config/email')
const regExp = require(pathLink + '/config/RegExp')
const send = require(pathLink + '/server/public/email/send')

let emailCodeObj = {}

function emailCont (code, lang) {
  let sendObj = {
    subject: '注册验证',
    cont: '<h1>您好：</h1><p style="margin-top:50px">您本次的验证码是：<span style="font-size:22px;font-weight:bold;">' + code + '</span></p><p style="margin-top:50px">有效时间为60分钟</p><p style="margin-top:70px;color:#999;">来自：SMPCWallet项目组</p><p style="color:#999;">这是封自动发送邮件。请不要回复该邮件。</p>',
    repeatTip: '操作频繁，请稍后尝试！'
  }
  if (lang && lang === 'en-US') {
    sendObj.subject = 'Registration verification'
    sendObj.cont = '<h1>Hello:</h1><p style="margin-top:50px">Your verification code this time is:<span style="font-size:22px;font-weight:bold;">' + code + '</span></p><p style="margin-top:50px">Valid for 60 minutes</p><p style="margin-top:70px;color:#999;">From: SMPCWallet Team</p><p style="color:#999;">This is an auto mail. Please do not reply to this email.</p>'
    sendObj.repeatTip = 'Frequent operation, please try later!'
  }
  return sendObj
}

function EmailValidRegister (socket, type, req) {
  const emailService = 'aliyun'
  let dateNow = Date.now()
  let data = {
    msg: 'Error',
    info: ''
  }
  let code = $$.createSixNum()
  let sendObj = emailCont(code, req.lang ? req.lang : '')
  if (!req.email) {
    data.error = 'Email is null!'
    socket.emit(type, data)
    return
  }
  if (emailCodeObj[req.email] && emailCodeObj[req.email].code) {
    let time = dateNow - emailCodeObj[req.email].timestamp
    if (time < (1000 * 60)) {
      data.error = sendObj.repeatTip
      socket.emit(type, data)
      return
    }
  }
  logger.info(req)
  async.waterfall([
    (cb) => {
      // UserInfo.find({email: req.email}).countDocuments((err, count) => {
      //   if (err) {
      //     cb(err)
      //   } else {
      //     if (count > 0) {
      //       cb('Repeat')
      //     } else {
      //       cb(null, count)
      //     }
      //   }
      // })
      cb(null, 0)
    },
    (count, cb) => {
      const mail = {
        // 发件人
        from: 'SMPCWallet<' + email[emailService].auth.user + '>',
        // from: email.auth.user,
        // 主题
        subject: sendObj.subject,
        // 收件人
        to: req.email,
        // 邮件内容，HTML格式
        html: sendObj.cont//接收激活请求的链接
      }
      logger.info(mail)
      send(mail, emailService).then(res => {
        logger.info(res)
        if (res.msg === 'Error') {
          // data.error = res.error
          cb(res.error)
        } else {
          emailCodeObj[req.email] = {
            code: code,
            timestamp: dateNow
          }
          // console.log(emailCodeObj)
          setTimeout(() => {
            if (emailCodeObj[req.email]) {
              delete emailCodeObj[req.email]
            }
          // }, 1000 * 6)
          }, 1000 * 60 * 60)
          data.info = 'Send success'
          cb(null, data)
        }
      })
    }
  ], (err, res) => {
    if (err) {
      data.error = err
    } else {
      data.msg = 'Success'
    }
    logger.info(type)
    logger.info(data)
    socket.emit(type, data)
  })
}

function UserInfoAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  if (!req || !req.ks || !req.address) {
    data.error = '注册失败'
    data.code = 'err_15'
    socket.emit(type, data)
    return
  }
  if (!req.username || !regExp.username.test(req.username)) {
    data.error = '用户名只能输入6-20个字母、数字、下划线'
    data.code = 'err_2'
    socket.emit(type, data)
    return
  }
  if (req.isOpenEmail) {
    if (!req.email || !regExp.email.test(req.email)) {
      data.error = '格式不正确'
      data.code = 'w_18'
      socket.emit(type, data)
      return
    }
    // console.log(req)
    // console.log(emailCodeObj)
    if (!req.code || !emailCodeObj[req.email] || !emailCodeObj[req.email].code || emailCodeObj[req.email].code !== req.code) {
      data.error = '验证码不匹配'
      data.code = 'w_6'
      socket.emit(type, data)
      return
    }
  }
  async.waterfall([
    (cb) => {
      let pwd = encryption(req.password)
      let userInfo = new UserInfo({
        username: req.username,
        address: req.address,
        timestamp: Date.now(),
        password: pwd,
        ks: req.ks,
        email: req.email ? req.email : ''
      })
      userInfo.save((err, res) => {
        if (err) {
          // data.error = err.toString()
          cb(err)
        } else {
          // logger.info(res)
          cb(null, res)
        }
        // socket.emit(type, data)
      })
    },
    (results, cb) => {
      UserInfo.find({username: req.username}).countDocuments((err, count) => {
        if (err) {
          // data.error = err.toString()
          cb(err)
        } else {
          // logger.info(count)
          if (count > 0) {
            if (req.isOpenEmail && req.email && emailCodeObj[req.email]) {
              delete emailCodeObj[req.email]
            }
            data.info = count
            cb(null, count)
          } else {
            cb('err_15')
          }
        }
      })
    }
  ], (err, res) => {
    if (err) {
      data.msg = 'Error'
      data.error = err.toString()
      if (err === 'err_15') {
        data.code = 'err_15'
        data.error = '注册失败'
      }
      logger.error(err.toString())
    } else {
      data.msg = 'Success'
    }
    socket.emit(type, data)
  })
}

// function UserInfoEdit (socket, type, req) {
//   let data = {
//     msg: 'Error',
//     info: ''
//   }
// }

function UserInfoFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? (Number(req.pageNum - 1) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}
  if (req) {
    if (req.username || req.username === 0) {
      params.username = req.username
    }
    if (req.address || req.address === 0) {
      params.address = req.address
    }
  }
  async.waterfall([
    (cb) => {
      UserInfo.find(params, {username: 1, ks: 1, address: 1, email: 1}).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          // logger.info(res)
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      UserInfo.find(params).countDocuments((err, results) => {
        if (err) {
          cb(err)
        } else {
          data.total = results
          data.info = list
          cb(null, data)
        }
      })
    }
  ], (err, res) => {
    if (err) {
      data.msg = 'Error'
      data.error = err.toString()
      logger.error(err.toString())
    } else {
      data.msg = 'Success'
    }
    socket.emit(type, data)
  })
}

function GetUserIsRepeat (socket, type, req) {
  let data = { msg: 'Error', info: [] },
      params = {}
  if (req) {
    if (req.username || req.username === 0) {
      params.username = req.username
    }
    if (req.address || req.address === 0) {
      params.address = req.address
    }
  }
  UserInfo.find(params).countDocuments((err, results) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = results
    }
    socket.emit(type, data)
  })
}

function GetUserAccount (socket, type, req) {
  let data = { msg: 'Error', info: [] },
      params = {}
  let pwd = encryption(req.password)
  if (req) {
    if (req.username || req.username === 0) {
      params.username = req.username
    }
    if (req.password || req.password === 0) {
      let pwd = encryption(req.password)
      params.password = pwd
    }
  }
  UserInfo.findOne(params, {username: 1,ks: 1,email:1}).exec((err, results) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = results
    }
    socket.emit(type, data)
  })
}

function UserInfosFn (socket, io) {
  socket.on('EmailValidRegister', (req) => {
    EmailValidRegister(socket, 'EmailValidRegister', req, io)
  })
  socket.on('UserInfoAdd', (req) => {
    UserInfoAdd(socket, 'UserInfoAdd', req, io)
  })
  socket.on('UserInfoFind', (req) => {
    UserInfoFind(socket, 'UserInfoFind', req, io)
  })
  socket.on('GetUserIsRepeat', (req) => {
    GetUserIsRepeat(socket, 'GetUserIsRepeat', req, io)
  })
  socket.on('GetUserAccount', (req) => {
    GetUserAccount(socket, 'GetUserAccount', req, io)
  })
}

// module.exports = {
//   UserInfoAdd,
//   UserInfoFind
// }

module.exports = UserInfosFn