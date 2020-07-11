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
        type: ''
      },
      {
        icon: '../../icon/m-2.png',
        text: '派单中',
        type: ''
      },
      {
        icon: '../../icon/m-3.png',
        text: '进行中',
        type: ''
      },
      {
        icon: '../../icon/m-4.png',
        text: '待评价',
        type: ''
      },
      {
        icon: '../../icon/m-5.png',
        text: '已取消',
        type: ''
      }
    ],

    nav_two: [
      {
        icon: '../../icon/m-1.png',
        text: '全部',
        type: ''
      },
      {
        icon: '../../icon/m-2.png',
        text: '预约中',
        type: ''
      },
      {
        icon: '../../icon/m-4.png',
        text: '待评价',
        type: ''
      }
    ],

    nav_three: [
      {
        icon: '../../icon/m-6.png',
        text: '店铺入驻',
        path: ''
      },
      {
        icon: '../../icon/m-7.png',
        text: '个人入驻',
        path: ''
      }
    ]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
  },

  getUser: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    console.log('参数', data)
    http.sendRequest('huishou.getusermember', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          user: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})