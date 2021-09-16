<template>
    <h2 style="text-align: center">播放页面</h2>
    <h3 id="userId" style="text-align: center"></h3>
    <center>
        <div>
            <video id="localVideo" class="video" autoplay="autoplay"></video>
            <video id="remoteVideo" class="video" height="500px" autoplay="autoplay"></video>
        </div>
    </center>

    <div style="text-align: center">
        <button id="callBtn" onclick="requestConnect()">建立连接</button>
        <button id="hangupBtn" onclick="hangupHandle()">断开连接</button>
    </div>

    <div style="text-align: center">对方id: <input id="toUserId" /></div>
</template>
<script>

export default {
    data() {
        return {
            WebRTC: null,
        };
    },
    created() {
        //;
    },
    methods: {
        init() {
            const localVideo = document.querySelector('#localVideo');
            const remoteVideo = document.querySelector('#remoteVideo');

            const callBtn = document.getElementById('callBtn');
            const hangupBtn = document.getElementById('hangupBtn');

            const config = {
                iceServers: [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }],
            };

            let peerConnection;

            let socket, userId, toUserId;
            userId = parseInt(Math.random() * 10000);
            document.getElementById('userId').innerText = '我的id:' + userId;

            // 本地流和远端流
            let localStream, remoteStream;
        },
        requestConnect() {
            toUserId = document.getElementById('toUserId').value;
            if (!toUserId) {
                alert('请输入对方id');
                return false;
            } else if (!socket) {
                alert('请先打开websocket');
                return false;
            } else if (toUserId == userId) {
                alert('自己不能和自己连接');
                return false;
            }
            //准备连接
            startHandle().then(() => {
                //发送给远端开启请求
                socket.send(JSON.stringify({ userId: userId, toUserId: toUserId, message: { type: 'connect' } }));
            });
        },
         //开启本地的媒体设备
    async  startHandle() {
        // 1.获取本地音视频流
        // 调用 getUserMedia API 获取音视频流
        let constraints = {
            video: true,
            audio: {
                // 设置回音消除
                noiseSuppression: true,
                // 设置降噪
                echoCancellation: true,
            }
        }

        await navigator.mediaDevices.getUserMedia(constraints)
            .then(gotLocalMediaStream)
            .catch((err) => {
                console.log('getUserMedia 错误', err);
                //创建点对点连接对象
            });

        createConnection();
    },
      startWebsocket() {
        toUserId = document.getElementById('toUserId').value
        let webSocketUrl = 'wss://' + location.host + '/websocket/' + userId
        if ('WebSocket' in window) {
            // console.log(1)
            socket = new WebSocket(webSocketUrl);
        } else if ('MozWebSocket' in window) {
            // console.log(2)
            socket = new MozWebSocket(webSocketUrl);
        }
        // socket = new SockJS('https://' + location.host + '/websocket/' + userId);
        //连接成功
        socket.onopen = function (e) {
            console.log('连接服务器成功!')
        };
        //server端请求关闭
        socket.onclose = function (e) {
            console.log('close')
            alert(JSON.stringify(e))

        };
        //error
        socket.onerror = function (e) {
            console.error(e)
            alert(JSON.stringify(e))
        };
        socket.onmessage = onmessage
    }
    },
    mounted() {},
};
</script>