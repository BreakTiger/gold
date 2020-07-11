const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      page: that.page,
      pagesize: 10,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.knowledge', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {

      }
    })
  },

  //知识详情
  toInfoDetail: function (e) {
    let id = e.currentTarget.dataset.id
    modal.navigate('/pages/infos_detail/infos_detail?id=', id)
  }
})