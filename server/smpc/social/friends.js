const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'userEnode')
const mongoose = require('mongoose')
const async = require('async')

const FriendsSys = mongoose.model('FriendsSys')
const UserEnodes = mongoose.model('UserEnodes')

function FriendAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  async.waterfall([
    (cb) => {
      FriendsSys.find({address: req.address, unIP: req.unIP}).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          if (res && res.length > 0) {
            cb('Repeat')
          } else {
            cb(null, res)
          }
        }
      })
    },
    (obj, cb) => {
      let friendsSys = new FriendsSys({
        username: req.username ? req.username : '',
        address: req.address ? req.address : '',
        unIP: req.unIP ? req.unIP : '',
        // signAll: req.signAll ? req.signAll : '',
        timestamp: Date.now()
      })
      friendsSys.save((err, res) => {
        if (err) {
          cb(err)
        } else {
          data.info = res
          UserEnodes.create({outChain: req.address}, (err, res) => {
            if (err) {
              cb(err)
            } else {
              logger.info('UserEnodes')
              logger.info(res)
              cb(null, res)
            }
          })
          // cb(null, res)
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

function FriendDel (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  FriendsSys.remove({address: req.address, unIP: req.unIP}).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function FriendFind (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  FriendsSys.find({address: req.address}).populate({
    path: 'outChain',
    model: 'UserEnodes',
    select: '_id',
  }).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      logger.info(res)
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
  // FriendsSys.find({address: req.address}, {unIP: 1, signAll: 1}).exec((err, res) => {
  //   if (err) {
  //     data.error = err.toString()
  //   } else {
  //     data.msg = 'Success'
  //     data.info = res
  //   }
  //   socket.emit(type, data)
  // })
}

function FriendSysFn (socket, io) {
  socket.on('FriendAdd', (req) => {
    FriendAdd(socket, 'FriendAdd', req, io)
  })
  socket.on('FriendDel', (req) => {
    FriendDel(socket, 'FriendDel', req, io)
  })
  socket.on('FriendFind', (req) => {
    FriendFind(socket, 'FriendFind', req, io)
  })
}
module.exports = FriendSysFn