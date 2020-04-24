const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'NodeInfos')
const mongoose = require('mongoose')
const async = require('async')
const web3 = require(pathLink + '/server/public/methods/web3.js')
const NodeInfos = mongoose.model('NodeInfos')
const NodeInfosDev = mongoose.model('NodeInfosDev')

let publicSort = {'sortId': -1, 'timestamp': 1}

function NodeAdd (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  let dateNow = Date.now()
  async.waterfall([
    (cb) => {
      let dataObj = {
        enode: '',
        status: 0
      }
      web3.setProvider(req.url)
      web3.dcrm.getEnode().then(res => {
        let cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        // console.log(cbData)
        if (cbData.Status === "Success") {
          dataObj = { status: 1, enode: cbData.Data.Enode }
          cb(null, dataObj)
        } else {
          cb('Add error!')
        }
      }).catch(err => {
        cb(err)
      })
    },
    (dataObj, cb) => {
      NodeInfos.find({
        $or: [
          {url: req.url},
          {name: req.name},
        ]
      }).sort(publicSort).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          if (res.length > 0) {
            cb('Repeat')
          } else {
            cb(null, dataObj)
          }
        }
      })
    },
    (dataObj, cb) => {
      let nodeInfos = new NodeInfos({
        url: req.url ? req.url : '',
        name: req.name ? req.name : '',
        sortId: 0,
        publisher: req.publisher ? req.publisher : '',
        address: req.address ? req.address : '',
        timestamp: dateNow,
        updatetime: dateNow,
        status: 1,
        enode: dataObj.enode
      })
      nodeInfos.save((err, res) => {
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
}

function NodeDel (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  NodeInfos.remove({_id: req.id}).exec((err, res) => {
    if (err) {
      logger.error(err)
      data.error = err.toString()
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function NodeEdit (socket, type, req) {
  let data = {
    msg: 'Error',
    info: ''
  }
  let dateNow = Date.now()
  async.waterfall([
    (cb) => {
      let dataObj = {
        enode: '',
        status: 0
      }
      web3.setProvider(req.url)
      web3.dcrm.getEnode().then(res => {
        let cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        // console.log(cbData)
        if (cbData.Status === "Success") {
          dataObj = { status: 1, enode: cbData.Data.Enode }
          cb(null, dataObj)
        } else {
          cb('Add error!')
        }
      }).catch(err => {
        cb(err)
      })
    },
    (dataObj, cb) => {
      NodeInfos.find({
        publisher: {$ne: req.publisher},
        $or: [
          {url: req.url},
          {name: req.name},
        ]
      }).sort(publicSort).exec((err, res) => {
        if (err) {
          cb(err)
        } else {
          if (res.length > 0) {
            cb('Repeat')
          } else {
            cb(null, dataObj)
          }
        }
      })
    },
    (dataObj, cb) => {
      NodeInfos.updateOne({_id: req.id}, {$set: {name: req.name, url: req.url, updatetime: dateNow, enode: dataObj.enode, status: 1,}}).exec((err, res) => {
      // nodeInfos.save((err, res) => {
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
}

function getNodeInfos (socket, type, req) {
  let data = { msg: 'Error', info: [] }
  NodeInfos.find({}, {url: 1, name: 1, status: 1}).sort(publicSort).exec((err, res) => {
    if (err) {
      data.msg = 'Error'
      data.error = err.toString()
      logger.error(err.toString())
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function getUserNodeInfos (socket, type, req) {
  let data = { msg: 'Error', info: [] },
      params = {}
  if (req) {
    if (req.publisher) {
      params.publisher = req.publisher
    }
    if (req.address) {
      params.address = req.address
    }
  }
  NodeInfos.find(params, {url: 1, name: 1, status: 1}).sort(publicSort).exec((err, res) => {
    if (err) {
      data.msg = 'Error'
      data.error = err.toString()
      logger.error(err.toString())
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}

function getNodeInfosDev (socket, type, req) {
  let data = { msg: 'Error', info: [] }
  NodeInfosDev.find({}, {url: 1, name: 1, status: 1}).sort(publicSort).exec((err, res) => {
    if (err) {
      data.msg = 'Error'
      data.error = err.toString()
      logger.error(err.toString())
    } else {
      data.msg = 'Success'
      data.info = res
    }
    socket.emit(type, data)
  })
}



function NodeInfosFn (socket, io) {
  socket.on('NodeAdd', (req) => {
    NodeAdd(socket, 'NodeAdd', req, io)
  })
  socket.on('NodeDel', (req) => {
    NodeDel(socket, 'NodeDel', req, io)
  })
  socket.on('NodeEdit', (req) => {
    NodeEdit(socket, 'NodeEdit', req, io)
  })
  socket.on('getNodeInfos', (req) => {
    getNodeInfos(socket, 'getNodeInfos', req, io)
  })
  socket.on('getUserNodeInfos', (req) => {
    getUserNodeInfos(socket, 'getUserNodeInfos', req, io)
  })
  socket.on('getNodeInfosDev', (req) => {
    getNodeInfosDev(socket, 'getNodeInfosDev', req, io)
  })
}

module.exports = NodeInfosFn
// module.exports = {
//   getNodeInfos
// }