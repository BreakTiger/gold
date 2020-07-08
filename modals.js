// api分装

//封装uniapp的api 如提示面板，跳转等
export default class modals {

  // 提示面板 - 不带按钮
  static showToast(title, icon) {
    return new Promise(function () {
      wx: showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: 1500
      })
    })
  }

  // 跳转 - 带参/无参
  static navigate(path, data) {
    return new Promise(function () {
      if (data) {
        wx.navigateTo({
          url: path + data
        })
      } else {
        wx.navigateTo({
          url: path
        })
      }
    })
  }
}
