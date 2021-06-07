const webSocket = new WebSocket("ws://Localhost:5500")

webSocket.onmessage = (event) =>{
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

let username
function sendUsername(){

    username = document.getElementById("usernem-input").nodeValue
    sendData({
        type:"store_user"
    })

}

function sendData(data){
    data.username = username
    webSocket.send(JSON.stringify(data))
}

let localStream
let peerConn
function startCall(){
    document.getElementById("video-call-div")
    .style.display = "inline"

    navigator.getUserMedia({
        video:{
            frameRate: 24,
            width: {
            min:480, indeal:720, max:1280
            },
            aspectRatio: 1.333333
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
                type:"store_candidate",
                candidate: e.candidate
            })    
        })



        createAndSendOffer()
    }, (error)=> {
        console.log(error)
    
    })

}

function createAndSendOffer(){
    peerConn.createOffer((offer) =>{
        sendData({
            type:"store_offer",
            offer: offer
        })

        peerConn.setLocalDescription(offer)
    }, (error) =>{
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