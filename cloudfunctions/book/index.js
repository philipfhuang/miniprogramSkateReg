// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-8go5u93y529b4a0b'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const startTimeReg = / - [\S]*/
  const endTimeReg = /日 [\S]* - /
  const currentYear = (new Date()).getFullYear() + '-'
  for (const r of event.results) {
    var startTimeStr = currentYear + r.replace('月', '-').replace('日', '').replace(startTimeReg, '')
    var endTimeStr = currentYear + r.replace('月', '-').replace(endTimeReg, ' ')
    var startTime = new Date(startTimeStr)
    var endTime = new Date(endTimeStr)
    console.log(startTime)
    var isAval = await isAvaliable(event.rink, startTime)
    if (!isAval) return {message: "fail"}
    await db.collection('reservations').add({
      data: {
        userid: wxContext.OPENID,
        username: event.username,
        rink: event.rink,
        startTime: startTime,
        endTime: endTime
      }
    }).then(res=> {
      console.log(res)
    })
  }
  return {
    message: "success"
  }
}

async function isAvaliable(rink, startTime) {
  let result = await db.collection('reservations').where({
    rink: rink,
    startTime: startTime
  }).get().then(res=> {
    if (res.data.length == 0) {
      return true
    }
    return false
  }).catch(res=>{
    return false
  })
  return await result
}