'use strict';

var stompClient = null;

window.addEventListener("load", setUp);
window.addEventListener('beforeunload', disconnectMessageSocket)

function setUp() {
    configSockets();
    createListeners();
    createBoard();
    //TODO preload game state (low as any movement will cause sync for all players.)
}

//=====================setup=====================

function createListeners() {
    $("#gameMap").bind('keypress', function (e) {
        var code = e.keyCode || e.which;
        switch (code) {
            case 38 || 87: //up
                moveUp();
            case 40 || 83: //down
                moveDown();
            case 37 || 65: //left
                moveLeft();
            case 39 || 68: //right
                moveRight();
            default:
                break;
        }
    });
}

function configSockets() {
    var socket = new SockJS('/lethani');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {

        console.log("Connected to Message Socket: " + frame);
        stompClient.subscribe('/game/messages', function (message) {
            receiveMessage(JSON.parse(message.body).content);
        });

        console.log("Connected to starting zone: " + frame);
        stompClient.subscribe('/game/zone/1', function (location) {
            receiveMessage(JSON.parse(location.body).content);
        });
    });
}

//=====================messaging=====================

function disconnectMessageSocket() {
    if(stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected = false;
    console.log("Disconnected from Socket");
}

function receiveMessage(message) {
    var userName = message.substr(0, message.indexOf(' '));
    var text = message.substr(message.indexOf(' ') +1);
    // message = `${userName} ${text}`;
    $("#messageTable").append("<p><span class='userNameText'>" + userName + " " + "</span><span class='textMessage'>" + text + "</span></p>");
}

function sendMessage() {
    var message = $("#messageField").val();
    var clearElement = document.getElementsByName('messageForm')[0];
    clearElement.reset();
    stompClient.send("/app/userTexts", {}, JSON.stringify({'message': message}));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
        sendMessage();
    })
});

//=====================game=====================

var boardState;

function createBoard(){

}

function moveUp(){

}

function moveDown(){

}

function moveLeft(){

}

function moveRight(){

}

function move(from, to) {
    fromChar = 
    if (isAttack()) {
        
    }
}

function move(from, to) {
    
}