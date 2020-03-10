const path = require('path').resolve('.')
const pathLink = path

const PersonTxns = require(pathLink + '/server/smpc/person/txns')
const PersonAccounts = require(pathLink + '/server/smpc/person/accounts')

function PersonFn (socket, io) {
  /**
   * 个人交易
   */
  PersonTxns(socket, io)
  /**
   * 个人账户
   */
  PersonAccounts(socket, io)
}

module.exports = PersonFn