const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

// 地图
var QQMapWX = require('../../qqmap-wx-jssdk.min.js')
var demo;


Page({

  data: {
    id: '', // 店铺ID

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

    detail: {},

    shop_name: '', //店名
    shop_img: [], //店铺图片
    content: '',//店铺介绍

    // 所在城市
    city_in: '请选择店铺所在的城市',
    province: '', //省份
    city: '', //城市
    area: '', //区域

    street: '', //详细介绍 - 手动输入

    lat: '',
    lon: '',

    // 营业时间
    times: '',
    time_one: '营业开始时间',
    time_two: '营业结束时间',

    phone: '', //手机号码

    kind_list: [], //经营类目

    kind_id: '', //经营类目ID

    kind_text: '', //经营类目说明

    is_huishou: 0, //是否上门回收

    rec_list: [
      {
        rec_city: '请选择上门回收的城市',
        rec_area_list: [],
        rec_city_text: '', //回收城市名称
        rec_city_id: '' //回收城市ID
      }
    ],

    huiCity: '',

    huiArea: ''

  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getMapKey()
    this.getInfo()
  },

  // 获取密钥
  getMapKey: async function () {
    let that = this
    await http.sendRequest('huishou.set', 'post', {}).then(function (res) {
      if (res.error == 0) {
        app.globalData.map_Key = res.list.baidumiyao
        demo = new QQMapWX({
          key: res.list.baidumiyao
        });
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //店铺申请信息
  getInfo: function () {
    let that = this
    let data = {
      id: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.geteditshop', 'post', data).then(function (res) {
      if (res.error == 0) {
        let detail = res.list
        // console.log(detail)
        // 绑定数据
        that.setData({
          detail: detail,
          shop_name: detail.shopname, //店名
          shop_img: detail.image, //店铺图
          content: detail.remark, //介绍

          //所在城市
          city_in: detail.address_area,
          province: detail.province, //省份
          city: detail.city, //城市
          area: detail.area, //区域
          street: detail.address, //街道

          //经纬度
          lat: detail.lat,
          lon: detail.lng,

          times: detail.yingyetime, //营业时间
          phone: detail.mobile, //手机号
          kind_id: detail.managementid, //经营类目ID
          kind_text: detail.management_text, //经营类目说明
          huiCity: detail.huicity, //回收城市集合
          huiArea: detail.huishouarea, //回收区域集合
          opened: detail.is_open
        })
        // 切割营业时间
        if (detail.yingyetime) {
          let arr = detail.yingyetime.split('-')
          that.setData({
            time_one: arr[0],
            time_two: arr[1]
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
    that.getKind()
  },

  // 经营类目列表
  getKind: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 50,
      type: 2
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
        // 判断 - 选择的经营类目
        if (that.data.kind_id) {
          let ids = that.data.kind_id
          list.forEach(function (item, index) {
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
      shopid: that.data.detail.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.editShopStatus', 'post', data).then(function (res) {
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

  // 存在回收业务
  have_hui: async function () {
    let that = this
    let l = []
    let item = {}
    let hcity = that.data.huiCity
    let harea = that.data.huiArea
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    for (let i = 0; i < hcity.length; i++) {
      let data = {
        city: hcity[i]
      }
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
            rec_city: hcity[i],
            rec_area_list: list,
            rec_city_text: texts.substring(0, texts.length - 1), //回收城市名称
            rec_city_id: ids.substring(0, ids.length - 1) //回收城市ID
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
    wx.hideLoading()
    that.clearns()
  },

  clearns: function () {
    let that = this
    let list = that.data.rec_list
    let a = ''
    let b = ''
    list.forEach(function (item, index) {
      console.log(item)
      a += item.rec_city + ','
      b += item.rec_city_text + ','
    })
    that.setData({
      huiCity: a.substring(0, a.length - 1),
      huiArea: b.substring(0, b.length - 1),
    })
  },

  //店铺名称
  getShopName: function (e) {
    this.setData({
      shop_name: e.detail.value
    })
  },

  // 店铺图片
  addPicture: function () {
    let that = this
    let list = that.data.shop_img
    wx.chooseImage({
      count: 5,
      success: function (res) {
        console.log(res)
        let path = res.tempFilePaths
        let news = list.concat(path)
        that.setData({
          shop_img: news.slice(0, 5)
        })
      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
  },

  // 删除
  del: function (e) {
    let that = this
    let list = that.data.shop_img
    let index = e.currentTarget.dataset.index
    list.splice(index, 1)
    that.setData({
      shop_img: list
    })
  },

  //店铺介绍
  introduce: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  //所在城市
  choice_city: function () {
    let that = this
    wx.getLocation({
      altitude: true,
      success: function (res) {
        wx.chooseLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: function (res) {
            console.log(res)
            let mp_address = res.address + '(' + res.name + ')'
            let lat = res.latitude
            let lon = res.longitude
            demo.reverseGeocoder({
              location: {
                latitude: lat,
                longitude: lon
              },
              success: function (res) {
                // console.log(res)
                that.setData({
                  city_in: mp_address,
                  province: res.result.address_component.province, //省份
                  city: res.result.address_component.city, //城市
                  area: res.result.address_component.district, //区域
                  lat: lat,
                  lon: lon
                })
              },
              fail: function (error) {
                console.log(error);
              }
            })
          }
        })
      },
      fail: function (error) {
        modal.showToast('获取定位失败，请检查手机是否开启定位功能', 'none')
      }
    })
  },

  // 详细地址
  setAddress: function (e) {
    this.setData({
      street: e.detail.value
    })
  },

  // 开始时间
  starTime: function (e) {
    this.setData({
      time_one: e.detail.value,
      times: e.detail.value + '-' + this.data.time_two
    })
  },

  //结束时间
  endTime: function (e) {
    this.setData({
      time_two: e.detail.value,
      times: this.data.time_one + '-' + e.detail.value
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
    //绑定
    let rcity = "rec_list[" + index + "].rec_city";
    that.setData({
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

  // 整理上门回收
  settle: function () {
    let that = this
    let list = that.data.rec_list
    // console.log(list)
    let a = ''
    let b = ''
    list.forEach(function (item, index) {
      console.log(item)
      a += item.rec_city + ','
      b += item.rec_city_text + ','
    })
    console.log(a)
    console.log(b)
    that.setData({
      huiCity: a.substring(0, a.length - 1),
      huiArea: b.substring(0, b.length - 1),
    })

    that.send()
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
    if (!that.data.shop_name) {
      modal.showToast('请填写店铺名称', 'none')
    } else if (that.data.time_one == '营业开始时间' || that.data.time_two == '营业结束时间') {
      modal.showToast('请选择营业开始时间，或营业结束时间', 'none')
    } else if (that.data.city_in == '请选择店铺所在的城市') {
      modal.showToast('请选择店铺所在城市', 'none')
    } else if (!that.data.street) {
      modal.showToast('请输入详细地址', 'none')
    } else if (!that.data.phone) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
      modal.showToast('请输入合法的手机号码', 'none')
    } else if (!that.data.kind_id) {
      modal.showToast('请选择经营类目', 'none')
    } else {
      // 判断是否存在店铺图片
      let list = that.data.shop_img
      console.log('店铺图：', list)
      if (list.length != 0) {
        that.upShopImg(list)
      } else {
        that.is_huishou()
      }
    }
  },

  //店铺图片上传
  upShopImg: async function (list) {
    let that = this
    let a = []
    let b = []
    for (let i = 0; i < list.length; i++) {
      let string = 'http://tmp/'
      if (list[i].search(string) != -1) {
        await http.upLoading(list[i], { type: 1 }).then(function (res) {
          let result = JSON.parse(res)
          if (result.error == 0) {
            a.push(result.list.url)
          } else {
            modal.showToast(result.message, 'none')
          }
        })
      } else {
        b.push(list[i])
      }
    }
    that.setData({
      shop_img: b.concat(a)
    })

    that.is_huishou()
  },

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

  send: function () {
    let that = this
    let data = {
      id: that.data.id,
      mobile: that.data.phone,
      managementid: that.data.kind_id,
      management_text: that.data.kind_text,
      lat: that.data.lat,
      lng: that.data.lon,
      image: that.data.shop_img,
      yinimages: that.data.detail.yinimages,
      shopname: that.data.shop_name,
      openid: wx.getStorageSync('openid'),
      province: that.data.province,
      city: that.data.city,
      area: that.data.area,
      address: that.data.street,
      huicity: that.data.huiCity,
      huishouarea: that.data.huiArea,
      yingyetime: that.data.times,
      remark: that.data.content || '',
      address_area: that.data.city_in
    }
    console.log('参数：', data)
    http.sendRequest('huishou.sbmitshop', 'post', data).then(function (res) {
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
  }














})