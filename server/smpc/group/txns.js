const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'GroupTxns')
const mongoose = require('mongoose')
const async = require('async')

const GroupTxns = mongoose.model('GroupTxns')

function gBroadcastTxns (socket, data) {
  for (let obj of data) {
    if (Number(obj.status) === 0) {
      socket.emit(obj.kId, obj)
    }
  }
}

function GroupTxnsAdd (socket, type, req) {
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
    txnId: req.txnId ? req.txnId : '',
    coinType: req.coinType ? req.coinType : 0,
    hash: req.hash ? req.hash : '',
    status: req.status ? req.status : 0,
    timestamp: dateNow,
  }
  let data = {
    msg: 'Error',
    info: ''
  }
  console.log(params)
  let groupTxns = new GroupTxns(params)
  groupTxns.save((err, res) => {
    if (err) {
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
    gBroadcastTxns(socket, req.gArr)
  })
}

function GroupTxnsEdit (params, updateParams) {
  return new Promise((resolve, reject) => {
    GroupTxns.updateOne(params, updateParams).exec((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function changeGroupMemberTxnsStatus (socket, type, req) {
  let params = {}, updateParams = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  if (req) {
    if (req.id || req.id === 0) {
      params._id = req.id
    }
    if (req.eNode) {
      params['member.eNode'] = req.eNode
    }

    if (req.status || req.status === 0) {
      updateParams['member.$.status'] = req.status
    }
    if (req.kId || req.kId === 0) {
      updateParams['member.$.kId'] = req.kId
    }
  }
  logger.info('changeGroupMemberTxnsStatus')
  logger.info(req)
  logger.info(params)
  logger.info(updateParams)
  GroupTxnsEdit(params, updateParams).then(res => {
    data.msg = 'Success'
    data.info = res
    socket.emit(type, data)
  }).catch(err => {
    data.error = err.toString()
    socket.emit(type, data)
  })
}

function changeGroupTxnsStatus (socket, type, req) {
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
  }
  logger.info('changeGroupTxnsStatus')
  logger.info(req)
  logger.info(params)
  logger.info(updateParams)
  GroupTxnsEdit(params, updateParams).then(res => {
    data.msg = 'Success'
    data.info = res
    socket.emit(type, data)
  }).catch(err => {
    data.error = err.toString()
    socket.emit(type, data)
  })
}

function GroupTxnsFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? (Number(req.pageNum - 1) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}

  if (req) {
    if (req.gId) {
      params.gId = req.gId
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
  
  logger.info('group')
  logger.info(req)
  logger.info(params)
  async.waterfall([
    (cb) => {
      GroupTxns.find(params).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      GroupTxns.find(params).countDocuments((err, results) => {
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

module.exports = {
  Add: GroupTxnsAdd,
  // Edit: GroupTxnsEdit,
  Find: GroupTxnsFind,
  changeGroupMemberTxnsStatus: changeGroupMemberTxnsStatus,
  changeGroupTxnsStatus: changeGroupTxnsStatus,
}