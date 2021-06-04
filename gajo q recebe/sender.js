const webSocket = new WebSocket("ws://Localhost:5500")

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
    }, (error)=> {
        console.log(error)
    
    })
}