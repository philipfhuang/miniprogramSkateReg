// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-8go5u93y529b4a0b' })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var disable = [[], [], []]

  var datesArray = []
  for (const dateStr of event.date) {
    datesArray.push(new Date(dateStr))
  }

  for (let i = 0; i < event.rinkInfo.time.length; i++) {
    for (let j = 0; j < event.rinkInfo.time[i].hours.length; j++) {
      var date = datesArray[i * 2]
      var startTimeStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + event.rinkInfo.time[i].hours[j].slice(0, 5)
      var startTime = new Date(startTimeStr)
      await db.collection('reservations').where({
        rink: event.rinkInfo.rink,
        startTime: startTime
      }).get().then(res => {
        if (res.data.length == 0) {
          disable[i].push(false)
        } else {
          disable[i].push(true)
        }
      }).catch(err => {
        console.log(err)
      })

      var date = datesArray[i * 2 + 1]
      var startTimeStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + event.rinkInfo.time[i].hours[j].slice(0, 5)
      var startTime = new Date(startTimeStr)
      await db.collection('reservations').where({
        rink: event.rinkInfo.rink,
        startTime: startTime
      }).get().then(res => {
        if (res.data.length == 0) {
          disable[i].push(false)
        } else {
          disable[i].push(true)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  return disable
}