import moment from 'moment'
/**
 * 
 * 根据消息更新好友列表
 * @param {*} userList 
 * @param {*} id 
 */
export function setGoodsTop(userList, data) {
    var newUserList = [];
    if (data.status == 0) {
        userList.forEach((value, key) => {
            if (value.id == data.to_id) {
                userList[key].send_time = moment().format('H:mm')
                if (data.msg_type == 1) {
                    userList[key].send_msg = data.msg
                } else if (data.msg_type == 2) {
                    userList[key].send_msg = '图片..'
                }
                else if (data.msg_type == 4) {
                    userList[key].send_msg = '语音..'
                }
                else {
                    userList[key].send_msg = data.msg
                }
                newUserList.push(userList[key]);
                userList.splice(key, 1)
                userList = newUserList.concat(userList);
            }
        });
    } else {
        userList.forEach((value, key) => {
            if (value.id == data.from_id) {
                userList[key].msg_total = Number(userList[key].msg_total) + 1
                userList[key].send_time = moment().format('H:mm')
                if (data.msg_type == 1) {
                    userList[key].send_msg = data.msg
                } else if (data.msg_type == 2) {
                    userList[key].send_msg = '图片..'
                }
                else if (data.msg_type == 4) {
                    userList[key].send_msg = '语音..'
                }
                else {
                    userList[key].send_msg = data.msg
                }
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
export function cleanMsg(userList, id) {
    userList.forEach((value, key) => {
        if (value.id == id) {
            userList[key].msg_total = ""
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
export function setUsersStatus(userList, id, status) {
    userList.forEach((value, key) => {
        if (value.id == id) {
            userList[key].status = Number(status)
        }
    });
    return userList
}
export function judgeData(content) {
    if (content.indexOf("http://") > -1 || content.indexOf("https://") > -1) {
        if (content.indexOf("png") > -1 || content.indexOf("jpeg") > -1 || content.indexOf("jpg") > -1 || content.indexOf("gif") > -1) {
            return 2
        } else {
            return 3
        }
    } else {
        return 1;
    }
}
export function DataBindA(content) {
    var regexp = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|-)+)/g;
    content = content.replace(regexp, function ($url) {
        return "<a href='" + $url + "' target='_blank'>" + $url + "</a>";
    });
    return content
}
export function renderTime(time) {
    time = parseInt(time);
    const nowStr = new Date();
    const localStr = time ? new Date(time) : nowStr;
    const localMoment = moment(localStr);
    const localFormat = localMoment.fromNow();
    return localFormat;
}
const utils = {
}
export default utils;