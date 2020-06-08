const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'nodeData')
const mongoose = require('mongoose')
const async = require('async')
const web3 = require(pathLink + '/server/public/methods/web3.js')

const NodeInfos = mongoose.model('NodeInfos')
const PersonAccounts = mongoose.model('PersonAccounts')
const PersonTxns = mongoose.model('PersonTxns')
const GroupAccounts = mongoose.model('GroupAccounts')
const GroupTxns = mongoose.model('GroupTxns')
const UserEnodes = mongoose.model('UserEnodes')
const UserInfo = mongoose.model('UserInfo')

let nodeObj = {
  nodeList: [],
  PAC: 0,
  PTC: 0,
  GAC: 0,
  GTC: 0,
  UC: 0
}

function getAllInfo () {
  async.waterfall([
    (cb) => {
      NodeInfos.find({}, {url: 1, name: 1, status: 1, enode: 1, timestamp: 1, nodeType: 1, version: 1}).sort({'sortId': -1, 'timestamp': 1}).exec((err, res) => {
        if (err) {
          nodeObj.nodeList = []
          logger.error(err.toString())
        } else {
          nodeObj.nodeList = res
        }
        cb(null, nodeObj)
      })
    },
    (data, cb) => {
      PersonAccounts.find().countDocuments((err, count) => {
        if (err) {
          nodeObj.PAC = 0
          logger.error(err.toString())
        } else {
          nodeObj.PAC = count
        }
        cb(null, nodeObj)
      })
    },
    (data, cb) => {
      PersonTxns.find().countDocuments((err, count) => {
        if (err) {
          nodeObj.PTC = 0
          logger.error(err.toString())
        } else {
          nodeObj.PTC = count
        }
        cb(null, nodeObj)
      })
    },
    (data, cb) => {
      GroupAccounts.find().countDocuments((err, count) => {
        if (err) {
          nodeObj.GAC = 0
          logger.error(err.toString())
        } else {
          nodeObj.GAC = count
        }
        cb(null, nodeObj)
      })
    },
    (data, cb) => {
      GroupTxns.find().countDocuments((err, count) => {
        if (err) {
          nodeObj.GTC = 0
          logger.error(err.toString())
        } else {
          nodeObj.GTC = count
        }
        cb(null, nodeObj)
      })
    },
    (data, cb) => {
      UserInfo.find().countDocuments((err, count) => {
        if (err) {
          nodeObj.UC = 0
          logger.error(err.toString())
        } else {
          nodeObj.UC = count
        }
        cb(null, nodeObj)
      })
    },
  ], () => {
    setTimeout(() => {
      getAllInfo()
    }, 1000 * 60 * 30)
  })
}

getAllInfo()

function NodeAndOtherData (socket, type, req) {
  let data = {
    msg: 'Success',
    info: nodeObj
  }
  if (!nodeObj.nodeList || nodeObj.nodeList.length <= 0) {
    setTimeout(() => {
      socket.emit(type, data)
    }, 1000)
  } else {
    socket.emit(type, data)
  }
}


function NodeData (socket, io) {
  socket.on('NodeAndOtherData', (req) => {
    NodeAndOtherData(socket, 'NodeAndOtherData', req, io)
  })
}
module.exports = NodeData