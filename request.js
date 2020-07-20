// 请求封装
// 网络请求 - 封装文件
const api = "https://huishou.pensee168.com/app/yun_shopv2_api.php?i=7&comefrom=wxapp&r=" //域名头部

//请求分装 -  不带有登录判断
function sendRequest(url, method, data) {

  var promise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
      mask: true
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

// 上传
function upLoading(filePath, data) {
  console.log('文件路径：', filePath)
  console.log('参数：', data)


}



module.exports = {
  sendRequest: sendRequest,
  upLoading: upLoading
}
