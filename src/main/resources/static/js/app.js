'use strict';

// const axios = require('axios');
var stompClient = null;

window.addEventListener("load", setUp());
window.addEventListener('beforeunload', disconnectMessageSocket)

function setUp() {
    configStrings();
    configSockets();
    getCurrentBoard();
    setPlayerStats();
    createListeners();
    
    setTimeout(() => { serverMessagePlayerJoin(); }, 1000);
}

//=====================setup=====================

function createListeners() {
    let testArea = document
    testArea.addEventListener('keydown', (e) => {
        // if(player.isDead) {
        //     break;
        // }
        console.log(e.key);
        switch (e.key) {
            case 'w': //up
                console.log("moving up")
                trigger_beep();
                moveUp();
                break;
            case 's': //down
                trigger_beep();
                moveDown();
                break;
            case 'a': //left
                trigger_beep();
                moveLeft();
                break;
            case 'd': //right
                trigger_beep();
                moveRight();
                break;
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
            receiveGameUpdate(JSON.parse(location.body));
        });
    });
}

function setPlayerStats() {
    const hp = $("#hp").text() * $("#classHp").text();
    const xp = parseInt($("#xp").text());

    player = {
        'position': { 'x': 10, 'y': 13 },
        'hp': hp,
        'xp': 1,
        'currentHp': hp,
        'attack': 1,
        'modifiers': {
            'attack': $("#classAttack").text(),
            'defence': 1
        },
        // 'isDead': false
    };
    loadHp(hp);
    player.xp = xp;
};

//=====================messaging=====================

function disconnectMessageSocket() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected = false;
    console.log("Disconnected from Socket");
}

function receiveMessage(message) {
    var userName = message.substr(0, message.indexOf(' '));
    var text = message.substr(message.indexOf(' ') + 1);
    $("#messageTable").append("<div class='textMessageDiv'><div class='nameDiv'><p class='pTagMessage'><span class='userNameText'>" + `${userName} ` + "</span></p></div><div class='messageTextDiv'><p class='textptag'><span class='textMessage'>" + text + "</span></p></div></div>");
}

function sendMessage() {
    var message = $("#messageField").val();
    var clearElement = document.getElementsByName('messageForm')[0];
    clearElement.reset();
    console.log(message)
    stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
        sendMessage();
    })
});

function serverMessagePlayerJoin() {
    var username = $("#username").text();
    console.log(username)
    var message = `[SERVER]:   ${username} has joined!`
    stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
}


//=====================game=====================

var currentMap = [];
var boardState = [];
var players = []; //player {username: jimbob, x: 0, y: 0}
var player;
var mobs = []; //mob {name: theirName, hp: 20, attack: 5, position{x: 0, y: 0}}

function receiveGameUpdate(newPlayerStates) {
    boardState = currentMap.map((x) => x);
    newPlayerStates.forEach(otherPlayer => {
        var username = $("#username").text();
        if (otherPlayer.userName != username) {
            boardState[otherPlayer.position.y] = boardState[otherPlayer.position.y].replaceAt(otherPlayer.position.x, '0');
        }
    });
    boardState[player.position.y] = boardState[player.position.y].replaceAt(player.position.x, '@');
    updateBoard(boardState);
}

function updateBoard(board) {
    $("#gameBoardContainer").empty();
    for (let i = 0; i < board.length; i++) {
        $("#gameBoardContainer").append("<p class='boardString'>" + board[i] + "</p>");
    }
}

function moveUp() {
    handleMove({ 'x': player.position.x, 'y': player.position.y - 1 });
}

function moveDown() {
    handleMove({ 'x': player.position.x, 'y': player.position.y + 1 });
}

function moveLeft() {
    handleMove({ 'x': player.position.x - 1, 'y': player.position.y });
}

function moveRight() {
    handleMove({ 'x': player.position.x + 1, 'y': player.position.y });
}

function handleMove(to) {
    const toChar = boardState[to.y][to.x];
    switch (toChar) {
        case '#':
            console.log("ran into a wall");
            break;
        case '.':
            console.log("moving");
            move(player.position, to);
            break;
        case '&':
            console.log("attacking");
            attack(to);
            break;
        case 'edge of board and access to another zone':
            changeZones();
            break;
        default:
            break;
    }
    console.log(player.position);
    updateBoard(boardState);
    console.log(player.position);
    stompClient.send("/app/gameLogic/1", {}, JSON.stringify({ 'position': player.position }));
}

function recievePlayerPositionUpdate(location) {
    console.log(location)
}

function move(from, to) {
    player.position = to;
    boardState[from.y] = boardState[from.y].replaceAt(from.x, '.');
    boardState[to.y] = boardState[to.y].replaceAt(to.x, '@');
}

//stretch timers and cool downs

function attack(to) { //todo
    var mob = mobs.find(mob => (mob.position.x == to.x && mob.position.y == to.y))
    console.log('fighting:' + mob);
    const damageDealt = Math.floor(Math.random() * ((player.attack * 1.2) - (player.attack * .8)) + (player.attack * .8));
    const damageTaken = Math.floor(Math.random() * ((mob.attack * 1.2) - (mob.attack * .8)) + (mob.attack * .8));
    //deal damage
    mob.hp = mob.hp - damageDealt;
    updateXp(5);
    if (mob.hp < 1) {
        //remove the mob
        updateXp(25);
        // trigger_attack_sound();
        var username = $("#username").text();
        var message = `[SERVER]:   ${username} kicked that dudes Ass!`
        stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
        for (var i = 0; i < mobs.length; i++) {
            if (mobs[i] === mob) {
                mobs.splice(i, 1);
            }
        }
        currentMap[to.y] = currentMap[to.y].replaceAt(to.x, '.');
        return;
    }
    //take damage
    updateHealth(-damageTaken);
}

function changeZones() { //stretch

}

function trigger_beep() {
    let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    sound.play();
}

// function trigger_attack_sound() {
//     let sound = new Audio("SUQzAwAAAAAfdlRJVDIAAAAmAAAAZmlnaHR2b2ljZWNsaXAgczA4d2EgMTYzIHNvdW5kIGVmZmVjdFRQRTEAAAAUAAAAZnJlZXNvdW5kZWZmZWN0Lm5ldFRBTEIAAAAUAAAAZnJlZXNvdW5kZWZmZWN0Lm5ldFRZRVIAAAAFAAAAMjAxNlRDT04AAAAFAAAAUm9ja0NPTU0AAAAPAAAAZW5nAGV4Y2VsbGVudCFUUkNLAAAABgAAADA0LzE2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//twCP+IgkQpRGhMG2BIhSiNCYNsBaSI40AFLRC0kRxoAKWiVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45N1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cgj/j/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
//     sound.play();
}
function getCurrentBoard() {

    $.ajax({
        url: '\\assets\\boards\\zone1.txt',
        success: (data) => {
            boardState = data.split(/\r\n|\r|\n/g);
            updateBoard(boardState);
            currentMap = boardState.map((x) => x);
            boardState.forEach(str => {
                str.replace('@', '.')
            });
            // boardState.forEach(str => str.replace('@', '.'));
            populateMobs();
        }
    })
}

function populateMobs() {
    for (let i = 0; i < boardState.length; i++) {
        for (let j = 0; j < boardState[0].length; j++) {
            let char = boardState[i][j];
            if (char == '&') {
                mobs.push({ 'name': 'silly bad guy', 'hp': 20, "attack": 1, 'position': { 'x': j, 'y': i } });
            }
        }
    }
}

//=====================Helpers==================

function configStrings() {
    String.prototype.replaceAt = function (index, replacement) {
        let temp = this.slice(0, index) + replacement + this.slice(index + replacement.length);
        return temp
    }
}

function updateXp(xp) {
    player.xp += xp;
    console.log();
    document.getElementById("xpScore").innerHTML = player.xp;
    $.ajax({
        url: `http://localhost:8080/updatexp/${xp}`,
        type: "POST",
        success: function (result) {
            console.log(result);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function loadHp(hp) {
    player.currentHp
    var g = document.createElement("progress");
    g.setAttribute("id", "pBar");
    g.setAttribute("value", `${hp}`);
    g.setAttribute("max", `${hp}`);
    g.setAttribute("min", 0);
    document.getElementById("hpBar").appendChild(g);
}

function updateHealth(hp) {
    player.currentHp += hp;
    if(player.currentHp > player.hp) {
        player.currentHp = player.hp;
    }
    if(player.currentHp < 1) {
        updateXp(-100);
        // player.isDead = true;
        var username = $("#username").text();
        var message = `[SERVER]:   ${username} clearly sucks at this game! Get gooder!`
        stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
        $(".gameDiv").hide();
        $("#deathNote").show();
        $("#deathButton").show();
    }
    document.getElementById("pBar").setAttribute("value", player.currentHp);
}

$("#deathNote").hide();
$("#deathButton").hide();

$("#deathButton").click(function() {
    setPlayerStats();
    // player.isDead = false;
    $(".gameDiv").show();
    $("#deathNote").hide();
    $("#deathButton").hide();
    updateHealth(player.hp);
});


// var snd = new Audio("rain.wav"); // buffers automatically when created
// snd.play();