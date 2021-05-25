'use strict';

var stompClient = null;

window.addEventListener("load", connectMessageSocket);
window.addEventListener('beforeunload', disconnectMessageSocket)

function connectMessageSocket() {

    var socket = new SockJS('/lethani');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {

        console.log("Connected to Message Socket: " + frame);
        stompClient.subscribe('/game/messages', function(message) {
            receiveMessage(JSON.parse(message.body).content);
        });

        // TODO Needs the second socket connection for data inserted here.
    })
}

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