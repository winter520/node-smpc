const path = require('path').resolve('.')
const pathLink = path

const GroupAccounts = require(pathLink + '/server/smpc/group/account')
const GroupTxns = require(pathLink + '/server/smpc/group/txns')

function GroupFn (socket, io) {
  /**
   * 共管交易
   */
  GroupTxns(socket, io)
  /**
   * 共管账户
   */
  GroupAccounts(socket, io)
}

module.exports = GroupFn