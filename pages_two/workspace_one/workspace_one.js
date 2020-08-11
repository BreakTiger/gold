const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    id: '',
    detail: {},
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    this.getData()
  },

  //店铺工作台
  getData: function () {
    let that = this
    let data = {
      id: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.editshop', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          detail: res.list
        })
      } else if (res.error == 2) {
        modal.showToast(res.message, 'none')
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 海报
  toPoster: function () {
    modal.navigate('/pages_two/poster_one/poster_one?id=', this.data.id)
  },

  //奖励中心
  toGift: function () {
    let data = {
      type: 2,
      id: this.data.id
    }
    modal.navigate('/pages_two/gift/gift?data=', JSON.stringify(data))
  },

  // 我的评论
  toPin: function () {
    modal.navigate('/pages_two/pin_one/pin_one?id=', this.data.id)
  },

  // 设置
  toSet: function () {
    modal.navigate('/pages_two/one_set/one_set?id=', this.data.id)
  },

  // 到店预约
  toOrder: function (e) {
    modal.navigate('/pages_two/one_order_list/one_order_list?type=', e.currentTarget.dataset.type + '&id=' + this.data.id)
  },

  // 上门回收
  toOder_rec: function (e) {
    modal.navigate('/pages_two/one_recy_list/one_recy_list?type=', e.currentTarget.dataset.type + '&id=' + this.data.id)
  }


})