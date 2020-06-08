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
      web3.dcrm.getVersion().then(res => {
        console.log(res)
        data.version = res.Data.Version
        resolve(data)
      }).catch(err => {
        data = { status: 0, enode: '', version: '' }
        resolve(data)
      })
      // logger.info('data')
      // logger.info(data)
      // resolve(data)
    }).catch(err => {
      logger.error(err)
      data = { status: 0, enode: '', version: '' }
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
            enode: data.enode,
            version: data.version,
            onlineTime: Date.now()
          }
        } else {
          updateParams = {
            status: 0
          }
        }
        console.log(updateParams)
        NodeInfos.updateOne({
          url: nodeObj.url
        },
        {$set: updateParams},
        {upsert: true}).exec((err, res) => {
          if (err) {
            logger.error(err)
          }
          console.log(res)
          cb(null, updateParams)
        })
      },
      (data, cb) => {
        if (data.status) {
          cb(null, data)
        } else {
          NodeInfos.findOne({ url: nodeObj.url }).exec((err, res) => {
            if (err) {
              logger.error(err)
              cb(null, res)
            } else {
              if (res.onlineTime && ( (Date.now() - res.onlineTime) >= (1000 * 60 * 60 * 24 * 7) ) ) {
              // if (res.onlineTime && ( (Date.now() - res.onlineTime) >= (1000 * 60) ) ) {
                NodeInfos.remove({ url: nodeObj.url }).exec(() => {
                  logger.warn('remove ' + nodeObj.url + 'success!')
                  cb(null, res)
                })
              } else {
                cb(null, res)
              }
            }
          })
        }
      }
    ], (err, res) => {
      callback(null, res)
    })
  }, (err, res) => {
    logger.info('Update node end!')
    setTimeout(() => {
      getAllNode()
    }, 1000 * 60 * 30)
    // }, 1000 * 60)
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