// 请求封装
// 网络请求 - 封装文件
const api = "" //域名头部

//请求分装 -  不带有登录判断
function wxRequest(url, method, data) {

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

module.exports = {
  wxRequest: wxRequest
  // uploadFile: uploadFile
}
