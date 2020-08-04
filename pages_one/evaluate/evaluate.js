const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {

    id: '',

    part: 0,

    choice: '../../icon/level.png',

    unchoice: '../../icon/levels.png',

    message: '', //评论内容

    picture: [],
    p_list: [],

    hides: 0
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  setLevel: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.setData({
      part: index + 1
    })
  },

  // 输入评论
  getMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  },

  // 添加图片
  addPicture: function () {
    let that = this
    let list = that.data.picture
    console.log(list)
    wx.chooseImage({
      count: 5,
      success: function (res) {
        let path = res.tempFilePaths
        console.log(path)
        let news = list.concat(path)
        console.log(news)
        that.setData({
          picture: news.slice(0, 5)
        })
      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
  },

  // 删除
  toDel: function (e) {
    let that = this
    let list = that.data.picture
    let index = e.currentTarget.dataset.index
    list.splice(index, 1)
    console.log(list)
    that.setData({
      picture: list
    })
  },

  //是否匿名
  is_choice: function () {
    let that = this
    let type = that.data.hides
    if (type) {
      that.setData({
        hides: 0
      })
    } else {
      that.setData({
        hides: 1
      })
    }
  },

  //提交-1
  sent: function () {
    let that = this
    if (that.data.part == 0) {
      modal.showToast('请选择评星', 'none')
    } else if (!that.data.message) {
      modal.showToast('请输入评价内容')
    } else {
      if (that.data.picture.length != 0) {
        that.upImg()
      } else {
        that.send()
      }
    }
  },

  // 上传
  upImg: async function () {
    let that = this
    let a = []
    let list = that.data.picture
    for (let i = 0; i < list.length; i++) {
      await http.upLoading(list[i], { type: 1 }).then(function (res) {
        let result = JSON.parse(res)
        if (result.error == 0) {
          a.push(result.list.url)
        } else {
          modal.showToast(result.message, 'none')
        }
      })
    }
    that.setData({
      p_list: a
    })
    that.send()
  },

  // 发布
  send: function () {
    let that = this
    let data = {
      id: that.data.id,
      openid: wx.getStorageSync('openid'),
      level: that.data.part,
      content: that.data.message,
      images: that.data.p_list || [],
      is_open: that.data.hides
    }
    console.log('参数：', data)
    http.sendRequest('huishou.addcomment', 'post', data).then(function (res) {
      if (res.error == 0) {
        console.log(res)
        modal.showToast('评论成功')
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }




})