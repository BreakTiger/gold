const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    nav: [
      {
        text: '全部',
        status: ''
      },
      {
        text: '派单中',
        status: '0'
      },
      {
        text: '进行中',
        status: '1'
      },
      {
        text: '待评价',
        status: '2'
      },
      {
        text: '已取消',
        status: '4'
      }
    ],

    choice: '', //选项

    page: 1,

    list: []
  },

  onLoad: function (options) {
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
      ordertype: 1
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //切换
  toSwitch: function (e) {
    this.setData({
      page: 1,
      choice: e.currentTarget.dataset.type
    })
    this.getList()
  },

  //取消订单
  toCancel: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您是否要取消该订单',
      success: function (res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          let index = e.currentTarget.dataset.index
          console.log(id)
          console.log(index)
          let data = {
            id: id,
            openid: wx.getStorageSync('openid')
          }
          console.log('参数：', data)
          http.sendRequest('huishou.delorder', 'post', data).then(function (res) {
            console.log(res)
            if (res.error == 0) {
              modal.showToast(res.message)
              let list = that.data.list
              list.splice(index, 1)
              that.setData({
                list: list
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },

  //完成
  toFinish: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    console.log(id)
    console.log(index)
    let data = {
      id: id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.complete', 'post', data).then(function (res) {
      if (res.error == 0) {
        let list = that.data.list
        list.forEach(function (item, indexs) {
          if (indexs == index) {
            item.orderstatus = 2
          }
        })
        that.setData({
          list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //详情
  toDetail: function (e) {
    modal.navigate('/pages_one/order-detail/order-detail?id=', e.currentTarget.dataset.id)
  },

  // 评论
  ping: function (e) {
    modal.navigate('/pages_one/evaluate/evaluate?id=', e.currentTarget.dataset.id)
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
    let old = that.data.list
    let page = that.data.page
    let data = {
      page: page + 1,
      pagesize: 10,
      status: that.data.choice,
      openid: wx.getStorageSync('openid'),
      type: 1,
      ordertype: 1
    }
    console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      console.log(res.list)
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