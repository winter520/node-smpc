const path = require('path').resolve('.')
const pathLink = path

const UserEnode = require(pathLink + '/server/smpc/social/userEnode')
// const FriendSysFn = require(pathLink + '/server/smpc/social/friends')

function SocialFn (socket, io) {
  /**
   * 用户Enode
   */
  UserEnode(socket, io)
  /**
   * 好友系统
   */
  // FriendSysFn(socket, io)
}

module.exports = SocialFn