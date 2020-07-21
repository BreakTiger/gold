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

  },

  data: {
    rule: ''
  },

  created() {
    this.getRule()
  },

  methods: {
    getRule: function () {
      let that = this
      http.sendRequest('huishou.set', 'post', {}).then(function (res) {
        console.log(res.list.dianxie)
        if (res.error == 0) {

        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }
})
