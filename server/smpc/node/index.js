const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'NodeInfos')
const mongoose = require('mongoose')
const async = require('async')

const NodeInfos = mongoose.model('NodeInfos')

function getNodeInfos (socket, type, req) {
  let data = { msg: 'Error', info: [] }
  NodeInfos.find().sort({'sortId': 1}).exec((err, res) => {
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
  socket.on('getNodeInfos', (req) => {
    getNodeInfos(socket, 'getNodeInfos', req, io)
  })
}

module.exports = NodeInfosFn
// module.exports = {
//   getNodeInfos
// }