const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {

    choice_date: 0,

    choice_time: 0,

    now_time: '', //预约时间点

    // 预约日期区间
    star_date: '', //开始日期

    end_date: '', //结束日期

    shop_list: [], //门店列表

    shop: '请选择预约门店', //所选店铺名

    shop_id: '', //所选店铺ID

    //营业时间区间
    star_time: '', //营业开始时间

    star_times: '',

    end_time: '', //营业结束时间

    end_times: '',

    time_one: '请选择预约日期',

    time_two: '预约到店时间',

    business: '预约业务',

    business_list: [], //店铺业务列表

    business_id: '', //所选的业务ID

    name: '',// 姓名

    phone: '',//电话
  },

  onLoad: function (options) {
    let that = this

    // 设置预约日期区间
    let date = new Date()

    //开始日期
    let stMonth = date.getMonth() + 1
    let stdate = date.getDate();
    if (stMonth < 10 && stdate < 10) {
      stMonth = '0' + (date.getMonth() + 1)
      stdate = '0' + date.getDate();
    }
    let today = date.getFullYear() + '-' + stMonth + '-' + stdate;
    console.log('开始日期:', today)

    // 增加一天的基础上增加30天
    let date2 = new Date(date);
    date2.setDate(date.getDate() + 30);
    let edMonth = (date2.getMonth() + 1)
    let eddate = date2.getDate()
    if (edMonth < 10 && eddate < 10) {
      edMonth = '0' + (date2.getMonth() + 1)
      eddate = '0' + date2.getDate();
    }
    let ed = date2.getFullYear() + "-" + edMonth + "-" + eddate
    console.log('结束日期:', ed)

    //当前时间点增加一小时
    let time = date.getTime() + 1000 * 60 * 60;
    let data3 = new Date(time)
    console.log('时间点:', data3.getHours() + ':' + data3.getMinutes())

    that.setData({
      now_time: data3.getHours() + ':' + data3.getMinutes(),
      star_date: today,
      end_date: ed
    })

    if (options.data) { // 回购页进入
      console.log('回购进入')
      let datas = JSON.parse(options.data)
      this.setData({
        phone: datas.phone
      })
    } else if (options.shopname) {// 详情页进入
      console.log('详情进入')
      console.log(options)
      let time = options.times.split('-')
      this.setData({
        shop: options.shopname,
        shop_id: options.id,
        choice_date: 1,
        star_time: time[0], //开始时间
        star_times: time[0],
        end_time: time[1], //结束时间
        end_times: time[1]
      })
      this.getBusiness()
    }
    this.getShop()
  },

  // 预约门店
  getShop: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 50,
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lon'),
      city: wx.getStorageSync('city')
    }
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          shop_list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择门店 - 获取门店的营业时间区间 - 触发业务接口
  choice_shop: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.shop_list
    let time = list[index].yingyetime.split('-')
    that.setData({
      shop: list[index].shopname,
      shop_id: list[index].id,
      choice_date: 1,
      star_time: time[0], //营业开始时间
      star_times: time[0],
      end_time: time[1], //营业结束时间
      end_times: time[1]
    })
    that.getBusiness()
  },

  //日期
  setDatas: function () {
    modal.showToast('请选择预约门店', 'none')
  },

  getData: function (e) {
    this.setData({
      time_one: e.detail.value,
      time_two: '预约到店时间',
      choice_time: 1
    })
    this.time_select()
  },

  time_select: function () {
    let that = this
    // 判断
    if (that.data.time_one == that.data.star_date) { //当天
      if (that.data.now_time >= that.data.star_time && that.data.now_time <= that.data.end_time) {
        console.log('营业时间区间中')
        this.setData({
          star_time: this.data.now_time,
        })
      } else {
        console.log('营业时间区间外部')
        that.setData({
          choice_time: 2
        })
      }
    } else { //不是当天
      console.log('不是当天')
      that.setData({
        star_time: this.data.star_times
      })
    }
  },

  //时间
  setTime: function () {
    let type = this.data.choice_time
    console.log(type)
    if (type == 0) {
      modal.showToast('请选择预约日期', 'none')
    } else if (type == 2) {
      modal.showToast('已临近营业结束时间，请选择另外的日期', 'none')
    }
  },

  getTime: function (e) {
    this.setData({
      time_two: e.detail.value
    })
  },

  //店铺业务
  getBusiness: function () {
    let that = this
    let data = {
      shopid: that.data.shop_id
    }
    http.sendRequest('huishou.getshopjing', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          business_list: res.items
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  get_business: function () {
    modal.showToast('请先选择预约门店', 'none')
  },

  set_business: function (e) {
    let that = this
    let list = that.data.business_list
    let index = e.detail.value
    that.setData({
      business: list[index].name,
      business_id: list[index].id
    })
  },

  //姓名
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //电话
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },


  // 提交
  toSend: function () {
    console.log(111)
    let that = this
    if (!that.data.shop_id) {
      modal.showToast('请选择预约门店', 'none', 'none')
    } else if (that.data.time_one == '请选择预约日期') {
      modal.showToast('请选择回收日期', 'none')
    } else if (that.data.time_two == '预约到店时间') {
      modal.showToast('请选择回收时间', 'none')
    } else if (!that.data.business_id) {
      modal.showToast('请选择预约业务', 'none')
    } else if (!that.data.name) {
      modal.showToast('请输入您的姓名', 'none')
    } else if (!that.data.phone) {
      modal.showToast('请输入您的手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
      modal.showToast('请输入合法的手机号码', 'none')
    } else {
      let data = {
        store_id: that.data.shop_id,
        yuyuetime: that.data.time_one + ' ' + that.data.time_two,
        mobile: that.data.phone,
        username: that.data.name,
        jingyingtype: that.data.business_id,
        ordertype: 2,
        openid: wx.getStorageSync('openid')
      }
      console.log('参数：', data)
      http.sendRequest('huishou.addyuOrder', 'post', data).then(function (res) {
        // console.log(res.list)
        if (res.error == 0) {
          modal.navigate('/pages_one/order_success/order_success?data=', JSON.stringify(res.list) + '&types=1')
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }





})