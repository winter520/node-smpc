const mongoose = require( 'mongoose' )
const Schema   = mongoose.Schema
const $$ = require('./methods')
const logger = require($$.config.link.logger).getLogger('DB')



const GroupTxns = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  from: {type: String},
  to: {type: String},
  value: {type: Number},
  nonce: {type: Number},
  member: {type: Array, default: []},
  gId: {type: String},
  coinType: {type: String},
  hash: {type: String},
  status: {type: Number, default: 0},
  mode: {type: String},
  timestamp: {type: Number, default: Date.now()},
  pubKey: {type: String},
  data: {type: String, default: ''},
  extendObj: {type: Object, default: {}}
}, {collection: "GroupTxns"})

const GroupAccounts = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  member: {type: Array, default: []},
  nonce: {type: Number},
  gId: {type: String},
  timestamp: {type: Number, default: Date.now()},
  status: {type: Number, default: 0},
  mode: {type: String},
  pubKey: {type: String},
}, {collection: "GroupAccounts"})

const PersonTxns = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  from: {type: String},
  to: {type: String},
  value: {type: Number},
  nonce: {type: Number},
  gId: {type: String},
  coinType: {type: String},
  hash: {type: String},
  kId: {type: String},
  eNode: {type: String},
  status: {type: Number, default: 0},
  mode: {type: String},
  timestamp: {type: Number, default: Date.now()},
  pubKey: {type: String},
  data: {type: String, default: ''},
  extendObj: {type: Object, default: {}}
}, {collection: "PersonTxns"})

const PersonAccounts = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  kId: {type: String},
  member: {type: Array, default: []},
  nonce: {type: Number},
  gId: {type: String},
  timestamp: {type: Number, default: Date.now()},
  status: {type: Number, default: 0},
  mode: {type: String},
  pubKey: {type: String},
}, {collection: "PersonAccounts"})

const NodeInfos = new Schema({
  url: {type: String, unique: true},
  name: {type: String},
  sortId: {type: Number},
  publisher: {type: String},
  address: {type: String},
  timestamp: {type: Number, default: Date.now()},
  updatetime: {type: Number, default: Date.now()},
  status: {type: Number, default: 1},
  enode: {type: String},
  nodeType: {type: Number, default: 1},
  version: {type: String, default:''},
  onlineTime: {type: Number, default: Date.now()},
}, {collection: "NodeInfos"})

const NodeInfosDev = new Schema({
  url: {type: String, unique: true},
  name: {type: String},
  sortId: {type: Number},
  publisher: {type: String},
  address: {type: String},
  timestamp: {type: Number, default: Date.now()},
  updatetime: {type: Number, default: Date.now()},
  status: {type: Number, default: 1},
  enode: {type: String},
}, {collection: "NodeInfosDev"})

const UserInfo = new Schema({
  username: {type: String, unique: true},
  address: {type: String},
  timestamp: {type: Number, default: Date.now()},
  password: {type: String},
  ks: {type: String},
  email: {type: String},
}, {collection: "UserInfo"})

const VersionInfo = new Schema({
  name: {type: String},
  level: {type: Number},
  version: {type: String, unique: true},
  timestamp: {type: Number, default: Date.now()},
  winUrl: {type: String},
  macUrl: {type: String},
  linusUrl: {type: String},
}, {collection: "VersionInfo"})

const UserEnodes = new Schema({
  enode: {type: String},
  sign: {type: String},
  address: {type: String},
  unIP: {type: String},
  ip: {type: String},
  updatetime: {type: Number, default: Date.now()},
  friendsArr: {type: Array, default: []},
}, {collection: "UserEnodes"})

const PrivateTxns = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  from: {type: String},
  to: {type: String},
  value: {type: Number},
  nonce: {type: Number},
  gId: {type: String},
  coinType: {type: String},
  hash: {type: String},
  status: {type: Number, default: 0},
  mode: {type: String},
  timestamp: {type: Number, default: Date.now()},
  kId: {type: String},
  eNode: {type: String},
  pubKey: {type: String},
  data: {type: String, default: ''},
  extendObj: {type: Object, default: {}}
}, {collection: "PrivateTxns"})

const PrivateAccounts = new Schema({
  username: {type: String, unique: true},
  address: {type: String},
  updatetime: {type: Number, default: Date.now()},
  password: {type: String},
  ks: {type: String},
  email: {type: String},
  pubKeyArr: {type: Array, default: []},
}, {collection: "PrivateAccounts"})

const Signs = new Schema({
  keyId: {type: String, unique: true},
  key: {type: String},
  from: {type: String},
  to: {type: String},
  value: {type: Number},
  nonce: {type: Number},
  member: {type: Array, default: []},
  gId: {type: String},
  coinType: {type: String},
  hash: {type: Array, default: []},
  status: {type: Number, default: 0},
  mode: {type: String},
  timestamp: {type: Number, default: Date.now()},
  pubKey: {type: String},
  rsv: {type: Array, default: []},
  data: {type: String, default: ''},
  extendObj: {type: Object, default: {}},
  accountType: {type: Number, default: 0},
}, {collection: "Signs"})

GroupTxns.index({timestamp: -1}, {background: 1})
GroupAccounts.index({timestamp: -1}, {background: 1})
PersonTxns.index({timestamp: -1}, {background: 1})
PersonAccounts.index({timestamp: -1}, {background: 1})
NodeInfos.index({sortId: -1, timestamp: -1}, {background: 1})
NodeInfosDev.index({sortId: -1, timestamp: -1}, {background: 1})
UserInfo.index({timestamp: -1}, {background: 1})
VersionInfo.index({timestamp: -1}, {background: 1})
UserEnodes.index({updatetime: -1}, {background: 1})
PrivateTxns.index({timestamp: -1}, {background: 1})
PrivateAccounts.index({updatetime: -1}, {background: 1})
// FriendsSys.index({timestamp: -1}, {background: 1})


mongoose.model('GroupTxns', GroupTxns)
mongoose.model('GroupAccounts', GroupAccounts)
mongoose.model('PersonTxns', PersonTxns)
mongoose.model('PersonAccounts', PersonAccounts)
mongoose.model('NodeInfos', NodeInfos)
mongoose.model('NodeInfosDev', NodeInfosDev)
mongoose.model('UserInfo', UserInfo)
mongoose.model('VersionInfo', VersionInfo)
mongoose.model('UserEnodes', UserEnodes)
mongoose.model('PrivateTxns', PrivateTxns)
mongoose.model('PrivateAccounts', PrivateAccounts)
mongoose.model('Signs', Signs)


mongoose.Promise = global.Promise
// $$.config.mongoDBurl = 'mongodb://47.103.55.126:27017/fusion'
logger.info("db.js")
logger.info($$.config.mongoDBurl)

mongoose.connect(process.env.MONGO_URI || $$.config.mongoDBurl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

/**
  * 连接成功
  */
mongoose.connection.on('connected', () => {
  logger.info("db.js")
  logger.info('Mongoose connection success: ' + $$.config.mongoDBurl)
})
/**
 * 连接异常
 */
mongoose.connection.on('error', err => {
  logger.error('Mongoose connection error: ' + err.toString())
})
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection disconnected')
})


module.exports = {
  GroupTxns: mongoose.model('GroupTxns'),
  GroupAccounts: mongoose.model('GroupAccounts'),
  PersonTxns: mongoose.model('PersonTxns'),
  PersonAccounts:  mongoose.model('PersonAccounts'),
  NodeInfos: mongoose.model('NodeInfos'),
  NodeInfosDev: mongoose.model('NodeInfosDev'),
  UserInfo: mongoose.model('UserInfo'),
  VersionInfo: mongoose.model('VersionInfo'),
  UserEnodes: mongoose.model('UserEnodes'),
  PrivateTxns: mongoose.model('PrivateTxns'),
  PrivateAccounts: mongoose.model('PrivateAccounts'),
  Signs: mongoose.model('Signs'),
}