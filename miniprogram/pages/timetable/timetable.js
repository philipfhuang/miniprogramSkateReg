// pages/timetable/timetable.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservations: [],
    networkError: false,
    rinks: {
      rocc: "River Oaks Community Centre",
      smsc: "Sixteen Mile Sports Complex",
      crc: "Centennial Recreation Centre"
    }
  },

  async getReservastions() {
    var today = new Date();
    var todaysDay = today.getDay(),
      diff = today.getDate() - todaysDay + (todaysDay == 0 ? -6 : 1);
    await db.collection('reservations').orderBy('startTime', 'asc').where({
      startTime: db.command.gte(new Date(today.setDate(diff)))
    }).get().then(res=> {
      this.setData({
        reservations: res.data
      })
    }).catch(() => {
      this.setData({
        networkError: true
      })
    })
    for (var i = 0; i < this.data.reservations.length; i++) {
      var str = this.data.reservations[i]
      str.startTime = str.startTime.toJSON()+''
      str.endTime = str.endTime.toJSON()+''
      this.setData({
        ['reservations['+i+']']: str
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getReservastions()
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