const path = require('path').resolve('.')
const pathLink = path

const PersonTxns = require(pathLink + '/server/smpc/person/txns')

function PersonFn (socket, io) {
  /**
   * 个人交易
   */
  PersonTxns(socket, io)
}

module.exports = PersonFn