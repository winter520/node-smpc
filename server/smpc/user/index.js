const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'UserInfo')
const mongoose = require('mongoose')
const async = require('async')

const UserInfo = mongoose.model('UserInfo')
const encryption = require(pathLink + '/server/public/methods/encryption')

function UserInfoAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  let pwd = encryption(req.password)
  let userInfo = new UserInfo({
    username: req.username,
    address: req.address,
    timestamp: Date.now(),
    password: pwd,
    ks: req.ks,
  })
  userInfo.save((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
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