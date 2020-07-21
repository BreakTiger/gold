const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {
    shop_name: '',
    license: '',
    picture: [],
    p_list: [],
    city_in: '请选择店铺所在的城市',
    address: '',
    phone: '',
    jing: '',
    city_rec: '请选择全市上门回收',
    area_rec: '',

    king_list: [],

    area_list: []
  },

  created() {
    this.getKind()
  },


  methods: {

    getKind: function () {
      let that = this
      let data = {
        page: 1,
        pagesize: 50,
        type: 2
      }
      // console.log('参数：', data)
      http.sendRequest('huishou.jingying', 'post', data).then(function (res) {
        // console.log(res.list)
        if (res.error == 0) {
          let list = res.list
          list.forEach(function (item) {
            item.choice = 0
          })
          that.setData({
            king_list: list
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //店名
    getShop: function (e) {
      this.setData({
        shop_name: e.detail.value
      })
    },
    // 执照
    getlicense: function () {
      let that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          // console.log(res)
          let path = res.tempFilePaths[0]
          that.setData({
            license: path
          })
        },
        fail: function (res) {
          modal.showToast('图片选择失败', 'none')
        }
      })
    },

    // 添加图片
    addPicture: function () {
      let that = this
      let list = that.data.picture
      wx.chooseImage({
        count: 5,
        success: function (res) {
          let path = res.tempFilePaths
          console.log(path)
          let news = list.concat(path)
          that.setData({
            picture: news.slice(0, 5)
          })
        },
        fail: function (res) {
          modal.showToast('图片选择失败', 'none')
        }
      })
    },

    //删除
    toDel: function (e) {
      let that = this
      let list = that.data.picture
      let index = e.currentTarget.dataset.index
      list.splice(index, 1)
      that.setData({
        picture: list
      })
    },

    //所在城市
    getCityin: function (e) {
      let city = e.detail.value
      let city_in = city[0] + city[1] + city[2]
      this.setData({
        city_in: city_in
      })
    },

    //详细地址
    toAddress: function (e) {
      this.setData({
        address: e.detail.value
      })
    },

    //手机号
    getPhone: function (e) {
      let that = this
      let data = {
        data: e.detail.encryptedData,
        code: wx.getStorageSync('code'),
        iv: e.detail.iv
      }
      http.sendRequest('wxapp.getWechatUserPhone', 'post', data).then(function (res) {
        if (res.error == 0) {
          that.setData({
            phone: res.data.phoneNumber
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //回收城市
    getCityRec: function (e) {
      let that = this
      let city = e.detail.value
      let city_rec = city[1]
      that.setData({
        city_rec: city_rec
      })
      let data = {
        city: city_rec
      }
      http.sendRequest('huishou.geuarea', 'post', data).then(function (res) {
        console.log(res.list)
        if (res.error == 0) {
          let area = res.list
          area.forEach(function (item) {
            item.choice = 0
          })
          that.setData({
            area_list: area
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //取消
    toCancel: function () {
      wx.navigateBack({
        delta: 1,
      })
    },

    //提交
    toSent: function () {
      let that = this
      if (!that.data.shop_name) {
        modal.showToast('请填写店铺名称', 'none')
      } else if (!that.data.license) {
        modal.showToast('请上传营业执照', 'none')
      } else if (that.data.city_in == '请选择店铺所在的城市') {
        modal.showToast('请选择店铺所在的城市', 'none')
      } else if (!that.data.address) {
        modal.showToast('请输入店铺的详细地址', 'none')
      } else if (!that.data.phone) {
        modal.showToast('请输入手机号码', 'none')
      }

    }




  }
})
