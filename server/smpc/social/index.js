const path = require('path').resolve('.')
const pathLink = path

const UserEnode = require(pathLink + '/server/smpc/social/userEnode')

function SocialFn (socket, io) {
  /**
   * 用户Enode
   */
  UserEnode(socket, io)
}

module.exports = SocialFn