const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    id: '',
    page: 1
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getList()
  },

  //列表
  getList: function () {
    let that = this
    let data = {
      shopid: that.data.id,
      type: 2,
      page: that.data.page,
      pagesize: 10
    }
    console.log('参数：', data)
    http.sendRequest('huishou.evaluate', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


})