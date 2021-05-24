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
            showMessage(JSON.parse(message.body).content);
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

function showMessage(message) {
    console.log(userName + ': ' + message)
    $("#messageTable").append("<tr><td>" `${userName}:` + message + "</tr></td>");
}

function sendMessage() {
    console.log("im herte")
    var message = $("messageField".val());
    console.log(message);
    stompClient.send("/app/userTexts", {}, JSON.stringify({'message': $("messageField").val()}));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    })
    $('messageSubmit').click(function() {
        sendMessage();
    })
});