// 请求封装
// 网络请求 - 封装文件
const api = "https://huishou.pensee168.com/app/yun_shopv2_api.php?i=7&comefrom=wxapp&r=" //域名头部

//请求分装 -  不带有登录判断
function sendRequest(url, method, data) {

  var promise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: api + url,
      method: method,
      data: data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail: function (res) {
        wx.hideLoading()
        reject(res);
      }
    })
  })

  return promise;

}

// 七牛云
const qiniuUploader = require("./components/qiniuUploader.js");
function uploadFile(filePath, utoken) {
  var promise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    console.log('文件：', filePath)
    qiniuUploader.upload(filePath,
      (res) => {
        uni.hideLoading();
        resolve(res)
      },
      (error) => {
        uni.hideLoading();
        reject(error)
      }, {
      region: 'SCN',
      uploadURL: 'https://up-z2.qiniup.com',
      domain: 'http://qakghu7iq.bkt.clouddn.com',
      uptoken: utoken
    }
    )
  })

  return promise;
}

module.exports = {
  sendRequest: sendRequest,
  uploadFile: uploadFile
}
