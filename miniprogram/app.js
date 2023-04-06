// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-8go5u93y529b4a0b',
        traceUser: true,
      });
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  globalData: {
    isLogin: false,
    userInfo: null,
    logining: false,
    isAdminChecked: false,
    isAdmin: false
  },

  login(that) {
    this.globalData.logining = true
    wx.getUserProfile({
      desc: '获取头像及昵称',
    }).then(res => {
      this.globalData.userInfo = res.userInfo
      this.globalData.isLogin = true
      this.globalData.logining = false
      if (that != null) {
        that.setData({
          isLogin: true,
          username: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },

  async checkAdmin() {
    await wx.cloud.callFunction({
      name: 'checkAdmin'
    }).then(res=> {
      if (res.result.message == "error") return
      this.globalData.isAdminChecked = true
      if (res.result) {
        this.globalData.isAdmin = true
      }
    })
  }
});
