const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'
const WxParse = require('../../wxParse/wxParse.js')

Page({


  data: {
    id: '',
    detail: {},
    aricle: ''
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDetail()
  },

  getDetail: function () {
    let that = this
    let data = {
      id: that.data.id
    }
    console.log('参数：', data)
    http.sendRequest('huishou.getknowledge', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          detail: res.list
        })
        let article = res.list.content
        WxParse.wxParse('article', 'html', article, that, 5);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onShareAppMessage: function (res) {
    //按钮转发
    if (res.from === 'button') {
      return {
        title: this.dataa.detail.name,
        path: '/pages_one/infos_detail/infos_detail?id=' + this.data.id
      }
    }
  }

})