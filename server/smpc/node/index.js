const path = require('path').resolve('.')
const pathLink = path

const UserInfos = require(pathLink + '/server/smpc/node/nodeInfo')
// const FriendSysFn = require(pathLink + '/server/smpc/social/friends')

function NodeInfosFn (socket, io) {
  /**
   * 用户Enode
   */
  UserInfos(socket, io)
}

module.exports = NodeInfosFn