const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'PersonTxns')
const mongoose = require('mongoose')
const async = require('async')

const PersonTxns = mongoose.model('PersonTxns')

function PersonTxnsAdd (socket, type, req) {
  let params = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  let dateNow = Date.now()
  let personTxns = new PersonTxns({
    keyId: dateNow + req.key,
    key: req.key ? req.key : '',
    from: req.from ? req.from : '',
    to: req.to ? req.to : '',
    value: req.value ? req.value : 0,
    nonce: req.nonce ? req.nonce : 0,
    coinType: req.coinType ? req.coinType : 0,
    hash: req.hash ? req.hash : '',
    status: req.status ? req.status : 0,
    timestamp: dateNow,
    kId: req.kId ? req.kId : 0,
    eNode: req.eNode ? req.eNode : '',
  })
  personTxns.save((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function PersonTxnsEdit (socket, type, req) {
  let params = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  if (req) {
    if (req.status || req.status === 0) {
      params.status = req.status
    }
  }
  PersonTxns.updateOne({ kId: req.kId }, params).exec((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function PersonTxnsFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? (Number(req.pageNum) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}

  if (req) {
    if (req.kId) {
      params.kId = req.kId
    }
    if (req.from || req.from === 0) {
      params.from = req.from
    }
    if (req.to || req.to === 0) {
      params.to = req.to
    }
    if (req.coinType || req.coinType === 0) {
      params.coinType = req.coinType
    }
    if (req.hash || req.hash === 0) {
      params.hash = req.hash
    }
    if (req.status || req.status === 0) {
      params.status = req.status
    }
  }
  logger.info('person')
  logger.info(req)
  logger.info(params)
  async.waterfall([
    (cb) => {
      PersonTxns.find(params).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      PersonTxns.find(params).countDocuments((err, results) => {
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


function PersonTxnsFn (socket, io) {
  socket.on('PersonAddTxns', (req) => {
    PersonTxnsAdd(socket, 'PersonAddTxns', req, io)
  })
  socket.on('PersonEditTxns', (req) => {
    PersonTxnsEdit(socket, 'PersonEditTxns', req, io)
  })
  socket.on('PersonFindTxns', (req) => {
    PersonTxnsFind(socket, 'PersonFindTxns', req, io)
  })
}
module.exports = PersonTxnsFn
// module.exports = {
//   Add: PersonTxnsAdd,
//   Edit: PersonTxnsEdit,
//   Find: PersonTxnsFind
// }