const webSocket = new WebSocket("ws://Localhost:5500")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data){
    switch ( data.type){
        case"answer":
            peerConn.setRemoteDescription(data.answer)
            break
        case"candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

function sendData(data){
    data.username = username
    webSocket.send(JSON.stringify(data))
}

let localStream
let peerConn
let username
function joinCall(){

    username = document.getElementById("username-input").Value

    document.getElementById("video-call-div")
    .style.display = "inline"

    navigator.getUserMedia({
        video:{
            frameRate: 24,
            width: {
            min:480, indeal:720, max:1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }, (stream) =>{
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers:[
                 {
                     "urls":["stun.l.google.com:19302",
                     "stun1.l.google.com:19302",
                     "stun2.l.google.com:19302"]
                 }

            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) =>{
            document.getElementById("remote-video").srcObject = e.stream
        }

        peerConn.onicecandidate = ((e) =>{
            if (e.candidate == null)
                return
            sendData({
                type:"send_candidate",
                candidate: e.candidate
            })    
        })


    }, (error)=> {
        console.log(error)
    
    })

}


let isAudio = true
funcion muteAudio() {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enable = isAudio

}

let isVideo = true
funcion muteVideo() {
    isVideo=!isVideo
    localStream.getVideoTracks()[0].enable = isVideo
}