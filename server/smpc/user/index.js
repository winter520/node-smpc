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

let emailObj = {}

function EmailValidRegister (socket, type, req) {
  let dateNow = Date.now()
  let data = {
    msg: 'Error',
    info: ''
  }
  if (!req.email) {
    data.error = 'Email is null!'
    socket.emit(type, data)
    return
  }
  if (emailObj[req.email] && emailObj[req.email].code) {
    let time = dateNow - emailObj[req.email].timestamp
    if (time < (1000 * 60)) {
      data.error = '操作频繁，请稍后尝试！'
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
      let code = $$.createSixNum()
      const mail = {
        // 发件人
        from: 'SMPCWallet<' + email.auth.user + '>',
        // from: email.auth.user,
        // 主题
        subject: '注册验证',
        // 收件人
        to: req.email,
        // 邮件内容，HTML格式
        html: '<h1>您好：</h1><p style="margin-top:50px">您本次的验证码是：<span style="font-size:22px;font-weight:bold;">' + code + '</span></p><p style="margin-top:50px">有效时间为60分钟</p><p style="margin-top:70px;color:#999;">来自：SMPCWallet项目组</p><p style="color:#999;">这是封自动发送邮件。请不要回复该邮件。</p>'//接收激活请求的链接
      }
      logger.info(mail)
      send(mail).then(res => {
        logger.info(res)
        if (res.msg === 'Error') {
          // data.error = res.error
          cb(res.error)
        } else {
          emailObj[req.email] = {
            code: code,
            timestamp: dateNow
          }
          setTimeout(() => {
            if (emailObj[req.email]) {
              delete emailObj[req.email]
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
  // let code = $$.createSixNum()
  // emailObj[req.email] = {
  //   code: code,
  //   timestamp: dateNow
  // }
  // const mail = {
  //   // 发件人
  //   from: 'SMPCWallet<' + email.auth.user + '>',
  //   // from: email.auth.user,
  //   // 主题
  //   subject: '注册验证',
  //   // 收件人
  //   to: req.email,
  //   // 邮件内容，HTML格式
  //   html: '<h1>您好：</h1><p style="margin-top:50px">您本次的验证码是：<span style="font-size:22px;font-weight:bold;">' + code + '</span></p><p style="margin-top:50px">有效时间为10分钟</p><p style="margin-top:70px;color:#999;">来自：SMPCWallet项目组</p><p style="color:#999;">这是封自动发送邮件。请不要回复该邮件。</p>'//接收激活请求的链接
  // }
  // send(mail).then(res => {
  //   if (res.msg === 'Error') {
  //     data.error = res.error
  //   } else {
  //     data.msg = 'Success'
  //     data.info = 'Send success'
  //   }
  //   setTimeout(() => {
  //     delete emailObj[req.email]
  //   // }, 1000 * 6)
  //   }, 1000 * 60 * 10)
  //   socket.emit(type, data)
  // })
}

function UserInfoAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  if (!req || !req.ks || !req.address) {
    data.error = '注册失败'
    socket.emit(type, data)
    return
  }
  if (!req.username || !regExp.username.test(req.username)) {
    data.error = '用户名不合法'
    socket.emit(type, data)
    return
  }
  if (req.isOpenEmail) {
    if (!req.email || !regExp.email.test(req.email)) {
      data.error = '邮箱格式错误'
      socket.emit(type, data)
      return
    }
    if (!req.code || !emailObj[req.email] || !emailObj[req.email].code || emailObj[req.email].code !== req.code) {
      data.error = '验证码不匹配'
      socket.emit(type, data)
      return
    }
  }
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
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
      if (req.isOpenEmail && req.email && emailObj[req.email]) {
        delete emailObj[req.email]
      }
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
      UserInfo.find(params, {username: 1, ks: 1, address: 1}).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          // logger.info(req)
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
  UserInfo.findOne(params, {username: 1,ks: 1}).exec((err, results) => {
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