/**
 * 
 * 根据消息更新好友列表
 * @param {*} newArrayData 
 * @param {*} id 
 */
export function setGoodsTop(newArrayData,id,data) {
    var temporaryArry = [];
    newArrayData.forEach((value, key) => {
        if (value.id == id) {
            var date = new Date()
            //时间+1
            if(data.status=1){
                newArrayData[key].msg_total=Number(newArrayData[key].msg_total)+1
            }
            newArrayData[key].send_time=date.getHours()+":"+date.getMinutes()
            //消息+1
            //具体消息
            newArrayData[key].send_msg=data.msg
            temporaryArry.push(newArrayData[key]);
            newArrayData.splice(key, 1)
            newArrayData = temporaryArry.concat(newArrayData);
        }
    });
    
    return newArrayData
}
export function cleanMsg(newArrayData,id)
{
    var temporaryArry = [];
    newArrayData.forEach((value, key) => {
        if (value.id == id) {
            newArrayData[key].msg_total=""
        }
    });
    
    return newArrayData
}



const utils ={

}

export default utils;