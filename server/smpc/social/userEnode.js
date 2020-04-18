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
    sign: req.enode + req.sign + req.address,
    unIP: req.username + '@' + req.ip,
    updatetime: Date.now()
  }
  UserEnodes.updateOne({
    enode: {$regex: req.nodeKey, $options:"$i"},
    unIP: {$regex: req.username, $options:"$i"},
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
  UserEnodes.find({
    $or: [
      {sign: {$regex: req.searchVal, $options:"$i"}},
      {unIP: {$regex: req.searchVal, $options:"$i"}},
    ]
  }, {unIP: 1, sign: 1}).limit(30).exec((err, res) => {
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
}
module.exports = UserEnodeFn