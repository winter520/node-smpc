const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'NodeInfos')
const mongoose = require('mongoose')
const async = require('async')
const web3 = require(pathLink + '/server/public/methods/web3.js')
const NodeInfos = mongoose.model('NodeInfos')

function getAndSetState (nodeArr) {
  async.eachSeries(nodeArr, (nodeObj, callback) => {
    async.waterfall([
      (cb) => {
        let data = {
          enode: '',
          state: 0
        }
        web3.setProvider(nodeObj.url)
        web3.dcrm.getEnode().then(res => {
          let cbData = res
          cbData = JSON.parse(cbData)
          // console.log(cbData)
          if (cbData.Status === "Success") {
            data = { state: 1, enode: cbData.Data.Enode }
          } else {
            data = { state: 0, enode: '' }
          }
          // logger.info(data)
          cb(null, data)
        }).catch(err => {
          logger.info(err)
          data = { state: 0, enode: '' }
          cb(null, data)
        })
      },
      (data, cb) => {
        let updateParams = {}
        if (data.state) {
          updateParams = {
            state: 1,
            enode: data.enode
          }
        } else {
          updateParams = {
            state: 0
          }
        }
        NodeInfos.updateOne({
          url: nodeObj.url
        },
        {$set: updateParams},
        {upsert: true}).exec((err, res) => {
          if (err) {
            logger.error(err)
          }
          cb(null, updateParams)
        })
      }
    ], (err, res) => {
      callback(null, res)
    })
  }, (err, res) => {
    logger.info('Update node end!')
    setTimeout(() => {
      getAllNode()
    }, 1000 * 60 * 30)
  })
}

function getAllNode () {
  NodeInfos.find().sort({timestamp: -1}).exec((err, res) => {
    if (err) {
      logger.info(err)
    } else {
      // logger.info(res)
      getAndSetState(res)
    }
  })
}

// getAllNode()
module.exports = getAllNode