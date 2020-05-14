const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'PersonAccounts')
const mongoose = require('mongoose')
const async = require('async')

const PersonAccounts = mongoose.model('PersonAccounts')

function PersonAccountsAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  let dateNow = Date.now()
  let personAccounts = new PersonAccounts({
    keyId: dateNow + req.key,
    key: req.key ? req.key : '',
    kId: req.kId ? req.kId : '',
    member: req.member ? req.member : [],
    gId: req.gId ? req.gId : '',
    nonce: req.nonce ? req.nonce : 0,
    timestamp: dateNow,
    status: 0,
    mode: req.mode ? req.mode : 0,
  })
  personAccounts.save((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function PersonAccountEdit (params, updateParams, socket, type) {
  let data = {
    msg: 'Error',
    info: ''
  }
  // logger.info('PersonAccountEdit')
  // logger.info(params)
  // logger.info(updateParams)
  PersonAccounts.updateOne(params, updateParams).exec((err, res) => {
    if (err) {
      logger.error(err)
      data.error = err.toString()
      socket.emit(type, data)
    } else {
      data.msg = 'Success'
      data.info = res
      socket.emit(type, data)
    }
  })
}

function changePersonAccountsEdit (socket, type, req) {
  let params = {}, updateParams = {}
  if (req) {
    if (req.id || req.id === 0) {
      params._id = req.id
    }
    if (req.status || req.status === 0) {
      updateParams.status = req.status
    }
    if (req.pubKey || req.pubKey === 0) {
      updateParams.pubKey = req.pubKey
    }
  }
  PersonAccountEdit(params, updateParams, socket, type)
}

function PersonAccountsFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? ((Number(req.pageNum) - 1) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}

  if (req) {
    if (!req.kId) {
      socket.emit(type, data)
      return
    }
    if (req.key) {
      params.key = req.key
    }
    if (req.keyId) {
      params.keyId = req.keyId
    }
    if (req.gId || req.gId === 0) {
      params.gId = req.gId
    }
    if (req.nonce || req.nonce === 0) {
      params.nonce = req.nonce
    }
    if (req.kId || req.kId === 0) {
      params.kId = req.kId
    }
    if (req.status || req.status === 0) {
      params.status = req.status
    }
  } else {
    socket.emit(type, data)
    return
  }
  
  // logger.info(type)
  // logger.info(req)
  // logger.info(params)
  async.waterfall([
    (cb) => {
      PersonAccounts.find(params).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          // logger.info(req)
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      PersonAccounts.find(params).countDocuments((err, results) => {
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

function PersonAccountsFn (socket, io) {
  socket.on('PersonAccountsAdd', (req) => {
    PersonAccountsAdd(socket, 'PersonAccountsAdd', req, io)
  })
  socket.on('changePersonAccountsEdit', (req) => {
    changePersonAccountsEdit(socket, 'changePersonAccountsEdit', req, io)
  })
  socket.on('PersonAccountsFind', (req) => {
    PersonAccountsFind(socket, 'PersonAccountsFind', req, io)
  })
}

module.exports = PersonAccountsFn