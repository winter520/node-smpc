const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'GroupAccounts')
const mongoose = require('mongoose')
const async = require('async')

const GroupAccounts = mongoose.model('GroupAccounts')

function gBroadcastTxns (socket, data) {
  // for (let obj of data) {
  //   if (Number(obj.status) === 0) {
  //     socket.emit(obj.kId, obj)
  //   }
  // }
}

function GroupAccountsAdd (socket, type, req) {
  let params = {}
  let data = {
    msg: 'Error',
    info: ''
  }
  let dateNow = Date.now()
  let groupAccounts = new GroupAccounts({
    keyId: dateNow + req.key,
    key: req.key ? req.key : '',
    member: req.member ? req.member : [],
    gId: req.gId ? req.gId : '',
    nonce: req.nonce ? req.nonce : 0,
    timestamp: dateNow,
    status: 0,
    mode: req.mode ? req.mode : 0,
  })
  groupAccounts.save((err, res) => {
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

function GroupAccountEdit (params, updateParams, socket, type) {
  let data = {
    msg: 'Error',
    info: ''
  }
  logger.info('GroupAccountEdit')
  logger.info(params)
  logger.info(updateParams)
  GroupAccounts.updateOne(params, updateParams).exec((err, res) => {
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

function GroupAccountsEdit (socket, type, req) {
  let params = {}, updateParams = {}
  if (req) {
    if (req.keyId || req.keyId === 0) {
      params.keyId = req.keyId
    }
    if (req.kId || req.kId === 0) {
      params['member.kId'] = req.kId
    }
    if (req.status || req.status === 0) {
      updateParams['member.$.status'] = req.status
      updateParams['member.$.timestamp'] = Date.now()
      if (req.status === 4 || req.status === 6) {
        updateParams.status = req.status
      }
    }
  }

  GroupAccountEdit(params, updateParams, socket, type)
}

function changeGroupAccountsEdit (socket, type, req) {
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
  GroupAccountEdit(params, updateParams, socket, type)
}

function GroupAccountsFind (socket, type, req) {
  let _params = {
		pageSize: req && req.pageSize ? req.pageSize : 50,
		skip: 0
	}
  _params.skip = req && req.pageNum ? (Number(req.pageNum - 1) * Number(_params.pageSize)) : 0

  let data = { msg: 'Error', info: [] },
      params = {}

  if (req) {
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
    if (req.eNode || req.eNode === 0) {
      params.member = {$elemMatch: {eNode: req.eNode}}
    }
    if (req.kId || req.kId === 0) {
      params.member = {$elemMatch: {kId: req.kId}}
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
      GroupAccounts.find(params).sort({'timestamp': -1}).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          // logger.info(req)
          cb(null, res)
        }
      })
    },
    (list, cb) => {
      GroupAccounts.find(params).countDocuments((err, results) => {
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
  Add: GroupAccountsAdd,
  Edit: GroupAccountsEdit,
  Find: GroupAccountsFind,
  changeGroupAccountsEdit: changeGroupAccountsEdit
}