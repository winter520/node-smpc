const path = require('path').resolve('.')
const pathLink = path

const Signs = require(pathLink + '/server/smpc/signs/sign')

function SignsFn (socket, io) {
  /**
   * 共管交易
   */
  Signs(socket, io)
}

module.exports = SignsFn