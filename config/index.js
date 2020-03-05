const path = require("path").resolve(".")
const pathLink = path
const httpPort = 8300

let publicSet = {
  /**
   * @description 环境配置
   *  @param dev: 开发环境
   *  @param pro: 生成环境
   */
  env: 'dev',
  // env: 'pro',
  /**
   * @description App名称
   */
  AppName: 'SMPC',
  /**
   * @description 服务启动端口
   */
  appPort: httpPort,
  /**
   * @description 数据库地址
   */
  mongoDBurl: 'mongodb://smpc:Fusion123456@139.196.26.212:27017/smpc',
  /**
   * @description 链接节点RPC地址
   */
  serverRPC: 'https://fsn.dev/api',
  /**
   * @description 前端文件上传和下载路径
   */
  file: {
    upload: '/usr/share/nginx/html/uploadFile',
    download: 'http://dcrm.network/uploadFile/'
  },
  /**
   * @description 通用文件路径
   */
  link: {
    db: pathLink + '/server/public/methods/db.js',
    web3: pathLink + '/server/public/methods/web3',
    logger: pathLink + '/server/public/methods/log4js',
  },
  /**
   * @description 日志提示配置
   */
  log: {
    client: 'Client-',
    server: 'Server-'
  }
}
// if (publicSet.env === 'pro') {
//   publicSet.mongoDBurl = 'mongodb://54.183.185.30:27017/ccdex'
// }
// publicSet.mongoDBurl = 'mongodb://user:123456@54.183.185.30:27017/ccdex'
// publicSet.mongoDBurl = 'mongodb://smpc:123456@localhost:27017/smpc'
// publicSet.mongoDBurl = 'mongodb://139.196.26.212:27017/smpc',
// publicSet.mongoDBurl = 'mongodb://smpc:Fusion123456@104.210.49.28:27017/smpc'
publicSet.mongoDBurl = 'mongodb://47.92.168.85:27017/smpc'

module.exports = publicSet