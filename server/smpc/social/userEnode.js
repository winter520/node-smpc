const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'userEnode')
const mongoose = require('mongoose')
const async = require('async')

const UserEnodes = mongoose.model('UserEnodes')

function UserEnodeAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  let updateParams = {
    enode: req.enode ? req.enode : '',
    sign: req.sign,
    address: req.address,
    unIP: req.username + '@' + req.ipName,
    ip: req.ip,
    updatetime: Date.now()
  }
  UserEnodes.updateOne({
    unIP: req.username + '@' + req.ipName,
  },
  {$set: updateParams},
  {upsert: true}).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function UserEnodeSearch (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  // UserEnodes.find({ unIP: req.searchVal}, {unIP: 1, sign: 1, enode: 1, address: 1}).limit(30).exec((err, res) => {
  UserEnodes.find({ unIP: req.searchVal}).limit(30).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function UserFriendAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  if (req.unIP === (req.username + '@' + req.ip)) {
    data.error = 'Repeat'
    socket.emit(type, data)
    return
  }
  async.waterfall([
    (cb) => {
      UserEnodes.find({ unIP: req.unIP, friendsArr: {$elemMatch: {address: req.address}}}).exec((err, res) => {
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
    (results, cb) => {
      UserEnodes.update({ unIP: req.unIP}, {$push: {friendsArr: {
        address: req.address,
        username: req.username,
        timestamp: Date.now()
      }}}).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          data.info = res
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
  // UserEnodes.update({ unIP: req.unIP}, {$push: {}})
}

function UserFriendRemove (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  UserEnodes.update(
    {
      unIP: req.unIP,friendsArr: {$elemMatch: {address: req.address}}
    },
    {$pull: {friendsArr: {address: req.address}}}
  ).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function UserFriendFind (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  UserEnodes.find({friendsArr: {$elemMatch: {address: req.address}}}).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function UserEnodeFn (socket, io) {
  socket.on('UserEnodeAdd', (req) => {
    UserEnodeAdd(socket, 'UserEnodeAdd', req, io)
  })
  socket.on('UserEnodeSearch', (req) => {
    UserEnodeSearch(socket, 'UserEnodeSearch', req, io)
  })
  socket.on('UserFriendAdd', (req) => {
    UserFriendAdd(socket, 'UserFriendAdd', req, io)
  })
  socket.on('UserFriendRemove', (req) => {
    UserFriendRemove(socket, 'UserFriendRemove', req, io)
  })
  socket.on('UserFriendFind', (req) => {
    UserFriendFind(socket, 'UserFriendFind', req, io)
  })
}
module.exports = UserEnodeFn