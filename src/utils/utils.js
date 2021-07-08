import moment from 'moment'
/**
 * 
 * 根据消息更新好友列表
 * @param {*} userList 
 * @param {*} id 
 */
export function setGoodsTop(userList,data) {
    var newUserList = [];
   
    if(data.status==0){
        userList.forEach((value, key) => {
            if (value.id == data.to_id) {
                userList[key].send_time=moment().format('H:mm')
                userList[key].send_msg=data.msg
                newUserList.push(userList[key]);
                userList.splice(key, 1)
                userList = newUserList.concat(userList);
            }
        });
    }else{
     
        userList.forEach((value, key) => {
        
            if (value.id == data.from_id) {
                userList[key].msg_total=Number(userList[key].msg_total)+1
                console.log('----',userList[key])
                userList[key].send_time=moment().format('H:mm')
                userList[key].send_msg=data.msg
                newUserList.push(userList[key]);
                userList.splice(key, 1)
                userList = newUserList.concat(userList);
            }
        });
    }
    return userList
}
/**
 * 设置提醒消息内容
 * @param {*} userList 
 * @param {*} id 
 * @returns 
 */
export function cleanMsg(userList,id)
{
    userList.forEach((value, key) => {
        if (value.id == id) {
            userList[key].msg_total=""
        }
    });
    return userList
}

/**
 * 设置用户状态
 * @param {*} userList 
 * @param {*} id 
 * @param {*} status 
 * @returns 
 */
export function setUsersStatus(userList,id,status){
    userList.forEach((value, key) => {
        if (value.id == id) {
            userList[key].status=Number(status)
        }
    });
    return userList
}



const utils ={

}

export default utils;