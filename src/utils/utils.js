
/**
 * 
 * 根据消息更新好友列表
 * @param {*} newArrayData 
 * @param {*} id 
 */
export function setGoodsTop(newArrayData,id) {
    var temporaryArry = [];
    newArrayData.forEach((value, key) => {
        if (value.id == id) {
            temporaryArry.push(newArrayData[key]);
            newArrayData.splice(key, 1)
            newArrayData = temporaryArry.concat(newArrayData);
        }
    });
    console.log(newArrayData);
    return newArrayData
}