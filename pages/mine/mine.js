const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    user: {},
    nav_one: [
      {
        icon: '../../icon/m-1.png',
        text: '全部',
        type: 0
      },
      {
        icon: '../../icon/m-2.png',
        text: '派单中',
        type: 1
      },
      {
        icon: '../../icon/m-3.png',
        text: '进行中',
        type: 2
      },
      {
        icon: '../../icon/m-4.png',
        text: '待评价',
        type: 3
      },
      {
        icon: '../../icon/m-5.png',
        text: '已取消',
        type: 4
      }
    ],

    nav_two: [
      {
        icon: '../../icon/m-1.png',
        text: '全部',
        type: 0
      },
      {
        icon: '../../icon/m-2.png',
        text: '预约中',
        type: 2
      },
      {
        icon: '../../icon/m-4.png',
        text: '待评价',
        type: 3
      }
    ]
  },

  onLoad: function (options) {
    this.getUser()
  },

  //用户信息
  getUser: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.getusermember', 'post', data).then(function (res) {
      // console.log(res)
      if (res.error == 0) {
        that.setData({
          user: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //上门回收
  enter_one: function (e) {
    modal.navigate('/pages_one/order-list/order-list')
  },

  //门店预约
  enter_two: function (e) {
    modal.navigate('/pages_one/recyc_order_list/recyc_order_list')
  },

  // 店铺入驻
  toApplyOne: function () {
    modal.navigate('/pages_two/apply_one/apply_one')
  },

  // 个人入驻
  toApplyTwo: function () {
    modal.navigate('/pages_two/apply_two/apply_two')
  },

  //店铺工作台
  space_one: function () {
    modal.navigate('/pages_two/workspace_one/workspace_one')
  },

  //个人工作台
  space_two: function () {
    modal.navigate('/pages_two/workspace_two/workspace_two')
  },


})