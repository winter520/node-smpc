const path = require("path").resolve(".")
const pathLink = path

const Web3 = require('web3')
// const $$ = require('./methods')
// const configData = require(pathLink + '/static/js/config')
// const logger = require(pathLink + '/server/public/methods/log4js').getLogger('Web3')
let web3 = new Web3()

// console.log(web3)
web3.extend({
  property: 'smpc',
  methods: [
    {
      name: 'reqDcrmAddr',
      call: 'smpc_reqDcrmAddr',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'acceptLockOut',
      call: 'smpc_acceptLockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'lockOut',
      call: 'smpc_lockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeLockOutInfo',
      call: 'smpc_getCurNodeLockOutInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getBalance',
      call: 'smpc_getBalance',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getLockOutNonce',
      call: 'smpc_getLockOutNonce',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getEnode',
      call: 'smpc_getEnode',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    },
    {
      name: 'getSDKGroupPerson',
      call: 'smpc_getSDKGroupPerson',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getEnodeStatus',
      call: 'smpc_getEnodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'createSDKGroup',
      call: 'smpc_createSDKGroup',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'setGroupNodeStatus',
      call: 'smpc_setGroupNodeStatus',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getGroupNodeStatus',
      call: 'smpc_getGroupNodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getSDKGroup',
      call: 'smpc_getSDKGroup',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getGroupByID',
      call: 'smpc_getGroupByID',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getAccounts',
      call: 'smpc_getAccounts',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getAccountsBalance',
      call: 'smpc_getAccountsBalance',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeReqAddrInfo',
      call: 'smpc_getCurNodeReqAddrInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrStatus',
      call: 'smpc_getReqAddrStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'acceptReqAddr',
      call: 'smpc_acceptReqAddr',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrNonce',
      call: 'smpc_getReqAddrNonce',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getLockOutStatus',
      call: 'smpc_getLockOutStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getVersion',
      call: 'smpc_getVersion',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    }
  ]
})


module.exports = web3
