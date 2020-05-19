const path = require("path").resolve(".")
const pathLink = path

const Web3 = require('web3')
// const $$ = require('./methods')
// const configData = require(pathLink + '/static/js/config')
// const logger = require(pathLink + '/server/public/methods/log4js').getLogger('Web3')
let web3 = new Web3()

// console.log(web3)
web3.extend({
  property: 'dcrm',
  methods: [
    {
      name: 'reqDcrmAddr',
      call: 'dcrm_reqDcrmAddr',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'acceptLockOut',
      call: 'dcrm_acceptLockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'lockOut',
      call: 'dcrm_lockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeLockOutInfo',
      call: 'dcrm_getCurNodeLockOutInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getBalance',
      call: 'dcrm_getBalance',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getLockOutNonce',
      call: 'dcrm_getLockOutNonce',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getEnode',
      call: 'dcrm_getEnode',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    },
    {
      name: 'getSDKGroupPerson',
      call: 'dcrm_getSDKGroupPerson',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getEnodeStatus',
      call: 'dcrm_getEnodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'createSDKGroup',
      call: 'dcrm_createSDKGroup',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'setGroupNodeStatus',
      call: 'dcrm_setGroupNodeStatus',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getGroupNodeStatus',
      call: 'dcrm_getGroupNodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getSDKGroup',
      call: 'dcrm_getSDKGroup',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getGroupByID',
      call: 'dcrm_getGroupByID',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getAccounts',
      call: 'dcrm_getAccounts',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getAccountsBalance',
      call: 'dcrm_getAccountsBalance',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeReqAddrInfo',
      call: 'dcrm_getCurNodeReqAddrInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrStatus',
      call: 'dcrm_getReqAddrStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'acceptReqAddr',
      call: 'dcrm_acceptReqAddr',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrNonce',
      call: 'dcrm_getReqAddrNonce',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getLockOutStatus',
      call: 'dcrm_getLockOutStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getVersion',
      call: 'dcrm_getVersion',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    }
  ]
})


module.exports = web3
