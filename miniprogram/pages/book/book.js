// pages/book/book.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rinkInfo: {
      day: [],
      time: []
    },
    dayStr: [],
    date: [],
    dateStr: [],
    nextWeek: [],
    TabCur: 0,
    dateTabCur: 0,
    scrollLeft: 0,
    result: [],
    disable: [[], [], []],
    show: false,
    showLogin: false,
    message: "请先登录"
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      dateTabCur: 0,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  confirm() {
    var that = this
    if (this.data.result.length === 0) return Toast("还未选择时间哦！")
    if (!getApp().globalData.isLogin) {
      this.setData({
        showLogin: true
      })
      return
    }
    this.setData({
      showLogin: false,
      show: true,
      message: this.data.result.join('\n')
    })
  },

  login() {
    getApp().login()
  },

  bookConfirm() {
    var that = this
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    });

    wx.cloud.callFunction({
      name: 'book',
      data: {
        results: this.data.result,
        rink: this.data.rinkInfo.rink,
        username: getApp().globalData.userInfo.nickName
      }
    }).then(res => {
      Toast.clear()
      if (res.result.message == "success") {
        Toast.success("预约成功")
      } else {
        Toast.fail("预约失败，请刷新后重试")
      }
    }).catch(() => {
      Toast.clear()
      Toast.fail("预约失败，请重试")
    })

  },

  bookCancel() {
    Toast("取消预约")
  },

  async checkAvaliable() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    });
    await wx.cloud.callFunction({
      name: 'checkAvaliable',
      data: {
        rinkInfo: this.data.rinkInfo,
        date: this.data.date
      }
    }).then(res => {
      this.setData({
        disable: res.result
      })
    }).catch(() => {
      Toast.fail("网络错误")
    })
    Toast.clear()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    });
    db.collection('timetable').where({ 'rink': options.rink }).get().then(res => {
      that.setData({
        rinkInfo: res.data[0]
      })
      for (const i of res.data[0].time) {
        var nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + (((i.day + 7 - nextDate.getDay()) % 7) || 7))
        const dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        var dayStr = dayArr[nextDate.getDay()]
        var dateStr = nextDate.getMonth() + 1 + '月' + nextDate.getDate() + '日'
        that.setData({
          dayStr: [...that.data.dayStr, dayStr],
          date: [...that.data.date, nextDate],
          dateStr: [...that.data.dateStr, dateStr]
        })

        var copyDate = new Date(nextDate)
        copyDate.setDate(copyDate.getDate() + 7)
        dateStr = copyDate.getMonth() + 1 + '月' + copyDate.getDate() + '日'
        that.setData({
          date: [...that.data.date, copyDate],
          dateStr: [...that.data.dateStr, dateStr]
        })
      }
      Toast.clear()
      this.checkAvaliable()
    })
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
    this.setData({
      disable: [[], [], []],
      result: []
    })
    this.checkAvaliable()
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