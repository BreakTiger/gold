const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    code: '',

    open_list: [
      {
        name: '营业中',
        open: 1
      },
      {
        name: '休息中',
        open: 0
      }
    ],

    opened: null,

    id: '',

    phone: '',

    kind_list: [],

    kind_id: '',

    kind_text: '',

    is_huishou: 0, //是否上门回收

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

  },

  onLoad: function (options) {
    wx.login({
      success: function (res) {
        console.log(res.code)
      }
    })
    this.setData({
      id: options.id
    })
    this.getData()
  },

  onShow: function () {
    let that = this
    that.wxLogin()
  },

  wxLogin: function () {
    let that = this
    wx.login({
      success: function (res) {
        console.log('code:', res.code)
        that.setData({
          code: res.code
        })
      }
    })
  },

  //申请数据
  getData: async function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    await http.sendRequest('huishou.getuserRow', 'post', data).then(function (res) {
      if (res.error == 0) {
        let detail = res.list
        console.log(detail)
        // 更新
        that.setData({
          phone: detail.mobile, //电话
          kind_id: detail.category_id,//经营类目ID
          kind_text: detail.businesscategory, //经营类目说明
          hui_province: detail.recycling_province, //省份
          huiCity: detail.recycling_city, //城市
          huiArea: detail.recycling_address, //区域
          opened: detail.is_open
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })

    this.getKind()
  },

  // 经营类目
  getKind: function () {
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
        if (that.data.kind_id.length != 0) {
          let ids = that.data.kind_id
          list.forEach(function (item) {
            ids.forEach(function (items) {
              if (items == item.id) {
                if (item.is_true == 1) {
                  item.choice = 1
                  if (item.is_huishou == 1) {
                    that.setData({
                      is_huishou: 1
                    })
                  }
                }
              }
            })
          })
          that.setData({
            kind_list: list
          })
          // 二段判断，是否有上门回收业务
          if (that.data.is_huishou == 1) {
            console.log('存在')
            that.have_hui()
          }
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  have_hui: async function () {
    let that = this
    let l = []
    let item = {}
    let hprovince = that.data.hui_province
    let hcity = that.data.huiCity
    let harea = that.data.huiArea
    console.log(hprovince)
    console.log(hcity)
    console.log(harea)
    for (let i = 0; i < hcity.length; i++) {
      let data = {
        city: hcity[i]
      }
      console.log('参数：', data)
      await http.sendRequest('huishou.geuarea', 'post', data).then(function (res) {
        if (res.error == 0) {
          let ids = ''
          let texts = ''
          let list = res.list
          list.forEach(function (items) {
            items.choice = 0
            harea.forEach(function (its) {
              if (its == items.area) {
                items.choice = 1
                let id = items.id
                let text = items.area
                ids += id + ','
                texts += text + ','
              }
            })
          })
          item = {
            rec_province: hprovince[i],//回收省份
            rec_city: hcity[i],
            rec_area_list: list,
            rec_city_text: texts.substring(0, texts.length - 1), //回收城市名称
            rec_city_id: ids.substring(0, ids.length - 1)  //回收城市ID
          }
          l.push(item)
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
    that.setData({
      rec_list: l
    })
    console.log(that.data.rec_list)
  },

  // 切换接单状态
  change_open: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    console.log(type)
    let opened = that.data.opened
    if (type != opened) {
      that.open_list()
    }
  },

  // 状态列表
  open_list: function () {
    let that = this
    let data = {
      uid: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.editUserStatus', 'post', data).then(function (res) {
      if (res.error == 0) {
        console.log(res.list)
        that.setData({
          opened: res.list.is_open
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //手机号 - 1
  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //手机号 - 2
  getPhone: function (e) {
    let that = this
    let data = {
      data: e.detail.encryptedData,
      code: that.data.code,
      iv: e.detail.iv
    }
    console.log(data)
    http.sendRequest('wxapp.getWechatUserPhone', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          phone: res.data.phoneNumber
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
    that.wxLogin()
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
            let list = [
              {
                rec_province: '',//回收省份
                rec_city: '请选择上门回收的城市',
                rec_area_list: [],
                rec_city_text: '', //回收城市名称
                rec_city_id: '' //回收城市ID
              }
            ]
            if (item.is_huishou == 1) {
              that.setData({
                is_huishou: 0,
                rec_list: list
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

  // 取消
  toCancel: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 提交判断
  toSent: function () {
    let that = this
    let list = that.data.rec_list
    console.log(list)
    let a = ''
    let b = ''
    let c = ''
    list.forEach(function (item) {
      // console.log(item)
      a += item.rec_city + ','
      b += item.rec_city_text + ','
      c += item.rec_province + ','
    })
    console.log(a)
    console.log(b)
    console.log(c)
    that.setData({
      hui_province: c.substring(0, c.length - 1),
      huiCity: a.substring(0, a.length - 1),
      huiArea: b.substring(0, b.length - 1),
    })
    that.send()
  },

  // 提交
  send: function () {
    let that = this
    let data = {
      id: that.data.id,
      category_id: that.data.kind_id,
      businesscategory: that.data.kind_text,
      recycling_province: that.data.hui_province,
      recycling_address: that.data.huiArea,
      recycling_city: that.data.huiCity,
      mobile: that.data.phone,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.editsettlement', 'post', data).then(function (res) {
      if (res.error == 0) {
        modal.showToast('修改成功')
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

})