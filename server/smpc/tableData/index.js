const path = require('path').resolve('.')
const pathLink = path

const NodeData = require(pathLink + '/server/smpc/tableData/nodeData')
// const FriendSysFn = require(pathLink + '/server/smpc/social/friends')

function TableDataFn (socket, io) {
  /**
   * 用户Enode
   */
  NodeData(socket, io)
}

module.exports = TableDataFn