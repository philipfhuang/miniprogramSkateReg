// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false
  },

  goReservation() {
    wx.switchTab({
      url: '/pages/reservation/reservation',
    })
  },

  goTimetable() {
    wx.navigateTo({
      url: '/pages/timetable/timetable'
    })
  },

  async checkAdmin() {
    await getApp().checkAdmin()
    this.setData({
      isAdmin: getApp().globalData.isAdmin
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!getApp().globalData.isadminChecked) {
      this.checkAdmin()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})