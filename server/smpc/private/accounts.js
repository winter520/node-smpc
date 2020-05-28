const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'PrivateAccounts')
const mongoose = require('mongoose')
const async = require('async')

const PrivateAccounts = mongoose.model('PrivateAccounts')

function PrivateAccountsAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  const query = {username: req.username}
  async.waterfall([
    (cb) => {
      PrivateAccounts.find(query).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          if (res && res.length > 0 && res[0].address !== req.address) {
            logger.info('User name already exists!')
            logger.info(res)
            cb('Repeat')
          } else {
            cb(null, res)
          }
        }
      })
    },
    (results, cb) => {
      let updateParams = {
        username: req.username,
        address: req.address,
        updatetime: Date.now(),
        ks: req.ks,
        email: req.email ? req.email : '',
        pubKeyArr: req.pubKeyArr ? req.pubKeyArr : '',
      }
      PrivateAccounts.updateOne({address: req.address}, updateParams, {upsert: true}).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          data.info = res
          cb(null, res)
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

function PrivateAccountsFind (socket, type, req) {
  let data = { msg: 'Error', info: [] },
      params = {}
  if (req) {
    if (req.username || req.username === 0) {
      params.username = req.username
    }
  }
  PrivateAccounts.findOne(params, {username: 1,ks: 1,email:1,pubKeyArr: 1}).exec((err, results) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = results
    }
    socket.emit(type, data)
  })
}

function PrivateAccountsFn (socket, io) {
  socket.on('PrivateAccountsAdd', (req) => {
    PrivateAccountsAdd(socket, 'PrivateAccountsAdd', req, io)
  })
  socket.on('PrivateAccountsFind', (req) => {
    PrivateAccountsFind(socket, 'PrivateAccountsFind', req, io)
  })
}

module.exports = PrivateAccountsFn