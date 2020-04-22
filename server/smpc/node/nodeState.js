const path = require('path').resolve('.')
const pathLink = path
const $$ = require(pathLink + '/server/public/methods/methods')
require($$.config.link.db)
const logger = require($$.config.link.logger).getLogger($$.config.log.client + 'nodeState')
const mongoose = require('mongoose')
const async = require('async')
const web3 = require(pathLink + '/server/public/methods/web3.js')
const NodeInfos = mongoose.model('NodeInfos')

function getEnode(url) {
  return new Promise(resolve => {
    let data = { enode: '', status: 0 }
    web3.setProvider(url)
    web3.dcrm.getEnode().then(res => {
      let cbData = res
      if (typeof res === 'string') {
        cbData = JSON.parse(cbData)
      }
      // console.log(cbData)
      if (cbData.Status === "Success") {
        data = { status: 1, enode: cbData.Data.Enode }
      } else {
        data = { status: 0, enode: '' }
      }
      // logger.info('data')
      logger.info(data)
      resolve(data)
    }).catch(err => {
      logger.error(err)
      data = { status: 0, enode: '' }
      resolve(data)
    })
  })
}
function getEnode2(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = { status: 0, enode: '' }
      logger.info(url)
      resolve(data)
    // }, 1000 * 1)
    }, 1000 * 50)
  })
}

function getEnodeResult(url) {
  return new Promise(resolve => {
    Promise.race([getEnode(url), getEnode2(url)]).then(res => {
      // console.log(res.toString())
      resolve(res)
    })
  })
}

function getAndSetState (nodeArr) {
  async.eachSeries(nodeArr, (nodeObj, callback) => {
    async.waterfall([
      (cb) => {
        logger.info(nodeObj.url)
        getEnodeResult(nodeObj.url).then(res => {
          cb(null, res)
        })
      },
      (data, cb) => {
        // logger.info(data)
        let updateParams = {}
        if (data.status) {
          updateParams = {
            status: 1,
            enode: data.enode
          }
        } else {
          updateParams = {
            status: 0
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
      logger.info(res)
      logger.info(res.length)
      getAndSetState(res)
    }
  })
}

// getAllNode()
module.exports = getAllNode