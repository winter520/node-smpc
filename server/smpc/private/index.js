const path = require('path').resolve('.')
const pathLink = path

const PrivateTxns = require(pathLink + '/server/smpc/private/txns')
const PrivateAccounts = require(pathLink + '/server/smpc/private/accounts')

function PrivateFn (socket, io) {
  /**
   * 个人交易
   */
  PrivateTxns(socket, io)
  /**
   * 个人账户
   */
  PrivateAccounts(socket, io)
}

module.exports = PrivateFn