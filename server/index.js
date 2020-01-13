
const path = require("path").resolve(".")
const pathLink = path

const PersonTxns = require(pathLink + '/server/smpc/person/index')
const GroupAccounts = require(pathLink + '/server/smpc/group/account')
const GroupTxns = require(pathLink + '/server/smpc/group/txns')


function PersonTxnsFn (socket, io) {
  socket.on('PersonAddTxns', (req) => {
    PersonTxns.Add(socket, 'PersonAddTxns', req, io)
  })
  socket.on('PersonEditTxns', (req) => {
    PersonTxns.Edit(socket, 'PersonEditTxns', req, io)
  })
  socket.on('PersonFindTxns', (req) => {
    PersonTxns.Find(socket, 'PersonFindTxns', req, io)
  })
}

function GroupAccountsFn (socket, io) {
  socket.on('GroupAccountsAdd', (req) => {
    GroupAccounts.Add(socket, 'GroupAccountsAdd', req, io)
  })
  socket.on('GroupAccountsEdit', (req) => {
    GroupAccounts.Edit(socket, 'GroupAccountsEdit', req, io)
  })
  socket.on('GroupAccountsFind', (req) => {
    GroupAccounts.Find(socket, 'GroupAccountsFind', req, io)
  })
  socket.on('changeGroupAccountsEdit', (req) => {
    GroupAccounts.changeGroupAccountsEdit(socket, 'changeGroupAccountsEdit', req, io)
  })
}

function GroupTxnsFn (socket, io) {
  socket.on('GroupAddTxns', (req) => {
    GroupTxns.Add(socket, 'GroupAddTxns', req, io)
  })
  socket.on('GroupEditTxns', (req) => {
    GroupTxns.Edit(socket, 'GroupEditTxns', req, io)
  })
  socket.on('changeGroupMemberTxnsStatus', (req) => {
    GroupTxns.changeGroupMemberTxnsStatus(socket, 'changeGroupMemberTxnsStatus', req, io)
  })
  socket.on('changeGroupTxnsStatus', (req) => {
    GroupTxns.changeGroupTxnsStatus(socket, 'changeGroupTxnsStatus', req, io)
  })
  socket.on('GroupFindTxns', (req) => {
    GroupTxns.Find(socket, 'GroupFindTxns', req, io)
  })
}

function StartSocket (socket, io) {
  /**
   * 个人交易
   */
  PersonTxnsFn(socket, io)
  /**
   * 共管交易
   */
  GroupTxnsFn(socket, io)
  /**
   * 
   */
  GroupAccountsFn(socket, io)
}

module.exports = StartSocket