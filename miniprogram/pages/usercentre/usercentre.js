// pages/usercentre/usercentre.js

const { default: Toast } = require("../../miniprogram_npm/@vant/weapp/toast/toast")



Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: getApp().globalData.isLogin,
    username: "Username",
    avatarUrl: null,
    finished: [],
    unfinished: [],
    rinks: {
      rocc: "River Oaks Community Centre",
      smsc: "Sixteen Mile Sports Complex",
      crc: "Centennial Recreation Centre"
    }
  },

  async login() {
    await getApp().login(this)
    this.getReservations()
  },

  getReservations() {
    // return
    wx.cloud.callFunction({
      name: 'getReservations'
    }).then(res=> {
      if (!res.result) {
        Toast.fail("网络错误")
        return
      }
      var today = new Date()
      for (const data of res.result.data) {
        var date = new Date(data.startTime)
        if (date > today) {
          this.setData({
            unfinished: [...this.data.unfinished, data]
          })
        } else {
          this.setData({
            finished: [...this.data.finished, data]
          })
        }
      }
    })
  },

  cancel(event) {
    console.log(event)
    wx.cloud.callFunction({
      name: 'cancel',
      data: {
        id: this.data.unfinished[event.currentTarget.dataset.index]._id
      }
    }).then(res=> {
      console.log(res)
      if (res.result.stats.removed != 0) {
        var data = this.data.unfinished
        data.splice(event.currentTarget.dataset.index)
        this.setData({
          unfinished: data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (this.data.isLogin) this.getReservations()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      isLogin: getApp().globalData.isLogin
    })
    if (this.data.isLogin) {
      this.setData({
        username: getApp().globalData.userInfo.nickName,
        avatarUrl: getApp().globalData.userInfo.avatarUrl
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      finished: [],
      unfinished: []
    })
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})