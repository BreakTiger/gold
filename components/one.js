const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

const WxParse = require('../wxParse/wxParse.js')

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {
    // 选择类型
    mold: [
      {
        name: '所属门店',
        type: '0'
      },
      {
        name: '个人从业者',
        type: '1'
      }
    ],
    choice: '',

    shop_list: [], //店铺列表

    kind_list: [], //经营类目列表

    shop_name: '请选择你所属的门店',

    shop_id: '',

    //身份证：
    img_one: '',
    img_ones: '',

    img_two: '',
    img_twos: '',

    phone: '', //手机号

    is_huishou: 0,

    kind_id: '',

    kind_text: '',

    rec_list: [
      {
        rec_province: '',//回收省份
        rec_city: '请选择上门回收的城市',
        rec_area_list: [],
        rec_city_text: '', //回收城市名称
        rec_city_id: '' //回收城市ID
      }
    ],

    hui_province: '',

    huiCity: '',

    huiArea: '',

    huiArea_id: '',

    shad: false

  },

  created() {
    wx.login({
      success: function (res) {
        console.log(res.code)
      }
    })

    this.getkind()
  },

  methods: {

    //经营类目
    getkind: function () {
      let that = this
      let data = {
        page: 1,
        pagesize: 50,
        type: 1
      }
      http.sendRequest('huishou.jingying', 'post', data).then(function (res) {
        if (res.error == 0) {
          let list = res.list
          list.forEach(function (item) {
            item.choice = 0
          })
          that.setData({
            kind_list: list
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    // 选择类型
    choice_type: function (e) {
      let type = e.currentTarget.dataset.type
      this.setData({
        choice: type
      })
      if (e.currentTarget.dataset.type == 0) {
        this.getShop()
      } else {
        this.setData({
          shop_name: '请选择你所属的门店',
          shop_id: ''
        })
      }
    },

    //店铺列表
    getShop: function () {
      let that = this
      let data = {
        page: 1,
        pagesize: 50,
        lat: wx.getStorageSync('lat'),
        lng: wx.getStorageSync('lng'),
        city: wx.getStorageSync('city')
      }
      http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
        console.log(res)
        if (res.error == 0) {
          that.setData({
            shop_list: res.list
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    // 选择所属门店
    choice_shop: function (e) {
      let that = this
      let index = e.detail.value
      let list = that.data.shop_list
      that.setData({
        shop_name: list[index].shopname,
        shop_id: list[index].id
      })
    },

    // 身份证
    add_one: function () {
      let that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          let path = res.tempFilePaths[0]
          that.setData({
            img_one: path
          })
        },
        fail: function (res) {
          modal.showToast('图片选择失败', 'none')
        }
      })
    },

    add_two: function () {
      let that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          let path = res.tempFilePaths[0]
          that.setData({
            img_two: path
          })
        },
        fail: function (res) {
          modal.showToast('图片选择失败', 'none')
        }
      })
    },

    // 手机号
    setPhone: function (e) {
      this.setData({
        phone: e.detail.value
      })
    },

    getPhone: function (e) {
      let that = this
      wx.login({
        success: res => {
          wx.setStorageSync('code', res.code)
          let data = {
            data: encodeURIComponent(e.detail.encryptedData),
            code: res.code,
            iv: e.detail.iv
          }
          console.log('参数：', data)
          http.sendRequest('wxapp.getWechatUserPhone', 'post', data).then(function (res) {
            console.log(res)
            if (res.error == 0) {
              that.setData({
                phone: res.data.phoneNumber
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      })
    },

    //选择经营类目
    choice_kind: function (e) {
      let that = this
      let list = that.data.kind_list
      let index = e.currentTarget.dataset.index
      let a = ''
      let b = ''
      list.forEach(function (item, indexs) {
        if (indexs == index) {
          if (item.is_true == 1) {
            if (item.choice == 0) {
              item.choice = 1
              if (item.is_huishou == 1) {
                that.setData({
                  is_huishou: 1
                })
              }
            } else {
              item.choice = 0
              if (item.is_huishou == 1) {
                that.setData({
                  is_huishou: 0
                })
              }
            }
          }
        }
        if (item.choice == 1) {
          let id = item.id
          let name = item.name
          a += id + ','
          b += name + ','
        }
      })
      //更新
      that.setData({
        kind_list: list,
        kind_id: a.substring(0, a.length - 1),
        kind_text: b.substring(0, b.length - 1)
      })
    },

    // 更多城市
    addCity: function () {
      let that = this
      let data = {
        rec_province: '',//回收省份
        rec_city: '请选择上门回收的城市',
        rec_area_list: [],
        rec_city_text: '', //回收城市名称
        rec_city_id: '' //回收城市ID
      }
      let list = that.data.rec_list
      list.push(data)
      that.setData({
        rec_list: list
      })
    },

    // 删除
    delIndex: function (e) {
      let that = this
      let list = that.data.rec_list
      let index = e.currentTarget.dataset.index
      list.splice(index, 1)
      that.setData({
        rec_list: list
      })
    },

    // 回收城市
    getRecCity: function (e) {
      let that = this
      let index = e.currentTarget.dataset.index
      // console.log('下标：', index)
      let city = e.detail.value[1]
      // console.log('城市：', city)
      let province = e.detail.value[0]
      //绑定
      let rprovince = "rec_list[" + index + "].rec_province";
      let rcity = "rec_list[" + index + "].rec_city";
      that.setData({
        [rprovince]: province,
        [rcity]: city
      })
      let data = {
        city: city
      }
      // console.log('参数：', data)
      http.sendRequest('huishou.geuarea', 'post', data).then(function (res) {
        // console.log(res)
        if (res.error == 0) {
          let alist = res.list
          alist.forEach(function (item) {
            item.choice = 0
          })
          let ralist = "rec_list[" + index + "].rec_area_list";
          that.setData({
            [ralist]: alist
          })
          // console.log(that.data.rec_list)
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //选择回收区域
    choice_area: function (e) {
      let that = this
      let findex = e.currentTarget.dataset.index
      let flist = e.currentTarget.dataset.list
      let iIndex = e.currentTarget.dataset.indexs
      let ids = ''
      let texts = ''
      flist.forEach(function (item, index) {
        if (index == iIndex) {
          if (item.choice == 0) {
            item.choice = 1
          } else {
            item.choice = 0
          }
        }
        if (item.choice == 1) {
          let id = item.id
          let text = item.area
          ids += id + ','
          texts += text + ','
        }
      })
      //更新
      let alist = "rec_list[" + findex + "].rec_area_list";
      let rtext = "rec_list[" + findex + "].rec_city_text";
      let rid = "rec_list[" + findex + "].rec_city_id";
      that.setData({
        [alist]: flist,
        [rtext]: texts.substring(0, texts.length - 1),
        [rid]: ids.substring(0, ids.length - 1)
      })
      console.log(that.data.rec_list)
    },

    // 协议
    protocol: function () {
      let that = this
      http.sendRequest('huishou.set', 'post', {}).then(function (res) {
        console.log(res.list)
        if (res.error == 0) {
          // 富文本解析
          let article = res.list.huixie
          WxParse.wxParse('article', 'html', article, that, 5);
          that.setData({
            shad: true
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //关闭
    close_cover: function () {
      this.setData({
        shad: false
      })
    },

    //取消
    toCancel: function () {
      wx.navigateBack({
        delta: 1,
      })
    },

    // 提交
    toSent: function () {
      let that = this
      if (!that.data.choice) {
        modal.showToast('请选择类型', 'none')
      } else if (!that.data.img_one) {
        modal.showToast('请上传身份证人像面照片', 'none')
      } else if (!that.data.img_two) {
        modal.showToast('请上传身份证国徽面照片', 'none')
      } else if (!that.data.phone) {
        modal.showToast('请输入手机号码', 'none')
      } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
        modal.showToast('请输入合法的手机号码', 'none')
      } else if (!that.data.kind_id) {
        modal.showToast('请选择经营类目', 'none')
      } else {
        // 判断类型
        if (that.data.choice == 0) {
          if (that.data.shop_name == '请选择你所属的门店') {
            modal.showToast('请选择你所属的门店', 'none')
          } else {
            that.upImg_one()
          }
        } else {
          that.upImg_one()
        }
      }
    },

    upImg_one: async function () {
      let that = this
      let path = that.data.img_one
      await http.upLoading(path, { type: 1 }).then(function (res) {
        let result = JSON.parse(res)
        if (result.error == 0) {
          that.setData({
            img_ones: result.list.url
          })
        } else {
          modal.showToast(result.message, 'none')
        }
      })
      that.upImg_two()
    },

    upImg_two: async function () {
      let that = this
      let path = that.data.img_two
      await http.upLoading(path, { type: 1 }).then(function (res) {
        let result = JSON.parse(res)
        if (result.error == 0) {
          that.setData({
            img_twos: result.list.url
          })
        } else {
          modal.showToast(result.message, 'none')
        }
      })

      that.is_huishou()
    },

    //上门回收判断
    is_huishou: function () {
      let that = this
      // 是否存在上门回收
      if (that.data.is_huishou == 1) {
        console.log('存在')
        // 三段判断 - 是否选择了上门回收城市
        let list = that.data.rec_list
        let count = 0;
        for (let i = 0; i < list.length; i++) {
          console.log(list[i])
          if (list[i].rec_city == '请选择上门回收的城市') {
            modal.showToast('请选择上门回收的城市', 'none')
          } else {
            if (list[i].rec_city_id) {
              count++;
            } else {
              modal.showToast('请选择上门回收的区域', 'none')
              break;
            }
          }
        }
        console.log('循环次数：', count)
        console.log('数组长度：', list.length)
        if (count == list.length) {
          that.settle()
        }
      } else {
        that.send()
      }
    },

    // 整理上门回收
    settle: function () {
      let that = this
      let list = that.data.rec_list
      // console.log(list)
      let a = ''
      let b = ''
      let c = ''
      let d = ''
      list.forEach(function (item, index) {
        console.log(item)
        a += item.rec_city + ','
        b += item.rec_city_text + ','
        c += item.rec_province + ','
        d += item.rec_city_id + ','
      })
      console.log(a)
      console.log(b)
      console.log(c)
      that.setData({
        hui_province: c.substring(0, c.length - 1),
        huiCity: a.substring(0, a.length - 1),
        huiArea: b.substring(0, b.length - 1),
        huiArea_id: d.substring(0, d.length - 1),
      })
      that.send()
    },

    send: function () {
      let that = this
      let data = {
        type: that.data.choice,
        store_id: that.data.shop_id,
        frontofidcatd: that.data.img_ones,
        reversecard: that.data.img_twos,
        category_id: that.data.kind_id,
        businesscategory: that.data.kind_text,
        recycling_province: that.data.hui_province,
        recycling_city: that.data.huiCity,
        recycling_address: that.data.huiArea,
        mobile: that.data.phone,
        openid: wx.getStorageSync('openid'),
        area_id: that.data.huiArea_id
      }
      console.log('参数：', data)
      http.sendRequest('huishou.addsettlement', 'post', data).then(function (res) {
        if (res.error == 0) {
          that.triggerEvent('Apply', { step: 2 })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }


  }
})
