// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'cloud1-8go5u93y529b4a0b'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('admin').where({
    openid: wxContext.OPENID
  }).get().then(res=> {
    if (res.data.length == 1) return true
    return false
  }).catch(res=>{
    return {message: "error"}
  })
}