
const path = require("path").resolve(".")
const pathLink = path

const PersonFn = require(pathLink + '/server/smpc/person/index')
const GroupFn = require(pathLink + '/server/smpc/group/index')
const NodeInfos = require(pathLink + '/server/smpc/node/index')
const UserInfos = require(pathLink + '/server/smpc/user/index')
const SocialFn = require(pathLink + '/server/smpc/social/index')
const TableDataFn = require(pathLink + '/server/smpc/tableData/index')
const PrivateFn = require(pathLink + '/server/smpc/private/index')

function StartSocket (socket, io) {
  /**
   * 个人交易
   */
  PersonFn(socket, io)
  /**
   * 共管账户
   */
  GroupFn(socket, io)
  /**
   * 节点设置
   */
  NodeInfos(socket, io)
  /**
   * 用户信息
   */
  UserInfos(socket, io)
  /**
   * 用户信息
   */
  SocialFn(socket, io)
  /**
   * 统计信息
   */
  TableDataFn(socket, io)
  /**
   * 私有账户
   */
  PrivateFn(socket, io)
}

module.exports = StartSocket