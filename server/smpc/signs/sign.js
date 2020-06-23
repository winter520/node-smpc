const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'Signs')
const mongoose = require('mongoose')
const async = require('async')

const Signs = mongoose.model('Signs')

function SignsAdd (socket, type, req) {
  let dateNow = Date.now()
  let params = {
    keyId: dateNow + req.key,
    key: req.key ? req.key : '',
    from: req.from ? req.from : '',
    to: req.to ? req.to : '',
    value: req.value ? req.value : 0,
    nonce: req.nonce ? req.nonce : 0,
    member: req.gArr ? req.gArr : [],
    gId: req.gId ? req.gId : '',
    coinType: req.coinType ? req.coinType : 0,
    hash: req.hash && req.hash.length > 0 ? req.hash : [],
    status: req.status ? req.status : 0,
    mode: req.mode ? req.mode : 0,
    timestamp: dateNow,
    pubKey: req.pubKey ? req.pubKey : '',
    rsv: req.rsv && req.rsv.length > 0 ? req.rsv : [],
    data: req.data ? req.data : '',
    extendObj: req.extendObj ? req.extendObj : {},
    accountType: req.accountType ? req.accountType : 0,
  }
  let data = {
    msg: 'Error',
    info: ''
  }
  console.log(params)
  let groupTxns = new Signs(params)
  groupTxns.save((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function SignsEdit (params, updateParams) {
  return new Promise((resolve, reject) => {
    Signs.updateOne(params, updateParams).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function changeSignMemberStatus (socket, type, req) {
  let params = {}, updateParams = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  if (req) {
    if (req.key || req.key === 0) {
      params.key = req.key
    }
    if (req.keyId || req.keyId === 0) {
      params.keyId = req.keyId
    }
    if (req.eNode) {
      params['member.eNode'] = req.eNode
    }

    if (req.status || req.status === 0) {
      updateParams['member.$.status'] = req.status
    }
    if (req.kId || req.kId === 0) {
      updateParams['member.$.kId'] = req.kId
      updateParams['member.$.timestamp'] = Date.now()
    }
  }
  // logger.info('changeSignMemberStatus')
  // logger.info(req)
  // logger.info(params)
  // logger.info(updateParams)
  SignsEdit(params, updateParams).then(res => {
    data.msg = 'Success'
    data.info = res
    socket.emit(type, data)
  }).catch(err => {
    data.error = err.toString()
    socket.emit(type, data)
  })
}

function changeSignsStatus (socket, type, req) {
  let params = {}, updateParams = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  if (req) {
    if (req.id || req.id === 0) {
      params._id = req.id
    }

    if (req.status || req.status === 0) {
      updateParams['status'] = req.status
    }
    if (req.hash || req.hash === 0) {
      updateParams['hash'] = req.hash
    }
    if (req.rsv || req.rsv === 0) {
      updateParams['rsv'] = req.rsv
    }
    if (req.extendObj && req.extendObj.hash) {
      updateParams['extendObj.hash'] = req.extendObj.hash
    }
  }
  // logger.info('changeSignsStatus')
  // logger.info(req)
  // logger.info(params)
  // logger.info(updateParams)
  SignsEdit(params, updateParams).then(res => {
    data.msg = 'Success'
    data.info = res
    socket.emit(type, data)
  }).catch(err => {
    data.error = err.toString()
    socket.emit(type, data)
  })
}

function SignsFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? ((Number(req.pageNum) - 1) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}
  console.log(req)
  if (req) {
    if (req.gId) {
      params.gId = req.gId
    }
    if (req.key) {
      params.key = req.key
    }
    if (req.pubKey) {
      params.pubKey = req.pubKey
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
    if (req.extendObj && req.extendObj.type) {
      // params.account = req.account
      params['extendObj.type'] = req.extendObj.type
    }
    if (req.kId || req.kId === 0) {
      // params.account = req.account
      params.member = {$elemMatch: {kId: req.kId}}
    }
  } else {
    socket.emit(type, data)
    return
  }
  
  logger.info('SignsFind')
  logger.info(req)
  logger.info(params)
  async.waterfall([
    (cb) => {
      Signs.find(params).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      Signs.find(params).countDocuments((err, results) => {
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

function SignsFn (socket, io) {
  socket.on('SignsAdd', (req) => {
    SignsAdd(socket, 'SignsAdd', req, io)
  })
  socket.on('changeSignMemberStatus', (req) => {
    changeSignMemberStatus(socket, 'changeSignMemberStatus', req, io)
  })
  socket.on('changeSignsStatus', (req) => {
    changeSignsStatus(socket, 'changeSignsStatus', req, io)
  })
  socket.on('SignsFind', (req) => {
    SignsFind(socket, 'SignsFind', req, io)
  })
}
module.exports = SignsFn