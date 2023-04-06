// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'cloud1-8go5u93y529b4a0b'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('reservations').doc(event.id).remove({
    success: function(res) {
      return res
    }
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}