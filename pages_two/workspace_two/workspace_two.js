const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',

    detail: {},

    enter_two: [
      {
        icon: '../../icon/m-1.png',
        text: '全部',
        type: ''
      },
      {
        icon: '../../icon/m-2.png',
        text: '已预约',
        type: '0'
      },
      {
        icon: '../../icon/m-4.png',
        text: '已完成',
        type: '2'
      }
    ]
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    this.getData()
  },

  //店铺信息
  getData: function () {
    let that = this
    let data = {
      id: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.settlement', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          detail: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 海报
  toPoster: function () {
    modal.navigate('/pages_two/poster_two/poster_two?id=', this.data.id)
  },

  // 奖励
  toGift: function () {
    let data = {
      type: 1,
      id: this.data.id
    }
    modal.navigate('/pages_two/gift/gift?data=', JSON.stringify(data))
  },

  // 评价
  toPin: function () {
    modal.navigate('/pages_two/pin_two/pin_two?id', this.data.id)
  },

  // 设置
  toSet: function () {
    modal.navigate('/pages_two/two_set/two_set?id=', this.data.id)
  },

  // 上门回收
  toOrder: function (e) {
    modal.navigate('/pages_two/two_order_list/two_order_list?type=', e.currentTarget.dataset.type + '&id=' + this.data.id)
  }

})