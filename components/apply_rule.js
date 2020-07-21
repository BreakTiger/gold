const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'
const WxParse = require('../wxParse/wxParse.js')

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },

  properties: {
    status: Number
  },

  data: {
    rule: ''
  },

  created() {
    this.getRule()
  },

  methods: {

    // 规则
    getRule: function () {
      let that = this
      http.sendRequest('huishou.set', 'post', {}).then(function (res) {
        if (res.error == 0) {
          // 富文本解析
          let status = that.properties.status
          console.log(status)
          if (status == 1) {
            let article = res.list.dianxie
            WxParse.wxParse('article', 'html', article, that, 5);
          } else {
            let article = res.list.userxie
            WxParse.wxParse('article', 'html', article, that, 5);
          }
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //不同意
    disagree: function () {
      wx.navigateBack({
        delta: 1,
      })
    },

    // 同意
    agree: function () {
      this.triggerEvent('Apply', { step: 1 })
    }


  }
})
