const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    nav: [
      {
        text: '全部',
        type: ''
      },
      {
        text: '预约中',
        type: '0'
      },
      {
        text: '待评价',
        type: '2'
      }
    ],
    choice: '',

    page: 1,
    list: []
  },


  onLoad: function (options) {
    console.log('type=', options.type)
    this.setData({
      choice: options.type
    })

  },

  onShow: function () {
    this.setData({
      page: 1
    })
    this.getList()
  },

  //列表
  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 10,
      status: that.data.choice,
      openid: wx.getStorageSync('openid'),
      type: 1,
      ordertype: 2
    }
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      // console.log(res.list)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 切换
  toSwitch: function (e) {
    this.setData({
      page: 1,
      choice: e.currentTarget.dataset.type
    })
    this.getList()
  },

  // 详情
  toDetail: function (e) {
    modal.navigate('/pages_one/recyc_order_detail/recyc_order_detail?id=', e.currentTarget.dataset.id)
  },

  // 评论
  ping: function (e) {
    modal.navigate('/pages_one/evaluate/evaluate?id=', e.currentTarget.dataset.id)
  },

  //取消
  cancel: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let data = {
      id: e.currentTarget.dataset.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数:', data)
    http.sendRequest('huishou.delorder', 'post', data).then(function (res) {
      if (res.error == 0) {
        modal.showToast('取消成功')
        let list = that.data.list
        setTimeout(() => {
          list.splice(index, 1)
          that.setData({
            list: list
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  //确认完成
  toFinish: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.complete', 'post', data).then(function (res) {
      if (res.error == 0) {
        modal.showToast('确认成功')
        setTimeout(() => {
          that.setData({
            page: 1
          })
          that.getList()
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.setData({
      page: 1
    })
    that.getList()
  },

  onReachBottom: function () {
    let that = this
    let page = that.data.page + 1
    let old = that.data.list
    let data = {
      page: page,
      pagesize: 10,
      status: that.data.choice,
      openid: wx.getStorageSync('openid'),
      type: 1,
      ordertype: 2
    }
    console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      // console.log(res.list)
      if (res.error == 0) {
        let news = res.list
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.page
          })
        } else {
          modal.showToast('已经到底了哦', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }

})