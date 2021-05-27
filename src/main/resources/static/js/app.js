'use strict';

// const axios = require('axios');
var stompClient = null;
var zone = "1";
let zoneSubscription;
let msgSubscription;

window.addEventListener("load", setUp());
window.addEventListener('beforeunload', disconnectMessageSocket)

function setUp() {
    configStrings();
    configSocket(1);
    getCurrentBoard(zone);
    setPlayerStats();
    createListeners();
    setTimeout(() => { serverMessagePlayerJoin(); }, 1000);
}

//=====================setup=====================

function createListeners() {
    let testArea = document
    testArea.addEventListener('keydown', (e) => {
        if (player.isDead) {
            return;
        }
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

function configSocket(zone) {
    var socket = new SockJS('/lethani');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) { createInitialSubscriptions(zone) });
}

function createInitialSubscriptions(zone) {
    console.log("Connected to Message Socket: " + stompClient.frame);
    msgSubscription = stompClient.subscribe('/game/messages', function (message) {
        receiveMessage(JSON.parse(message.body).content);
    });

    console.log("Connected to starting zone: " + stompClient.frame);
    zoneSubscription = stompClient.subscribe(`/game/zone/${zone}`, function (location) {
        receiveGameUpdate(JSON.parse(location.body));
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
        'isDead': false,
    };
    loadHp(hp);
    player.xp = xp;
};

//=====================messaging=====================

function disconnectMessageSocket() {
    var username = $("#username").text();
    var message = `[SERVER]:   ${username} has left!`
    stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
    if (stompClient !== null) {
        stompClient.disconnect();
    }
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
    boardState[player.position.y] = boardState[player.position.y].replaceAt(player.position.x, '@');
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
        case 'X':
            changeZones();
            break;
        default:
            break;
    }
    console.log(player.position);
    updateBoard(boardState);
    console.log(player.position);
    stompClient.send(`/app/gameLogic/${zone}`, {}, JSON.stringify({ 'position': player.position }));
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
    player.attack = Math.floor(player.xp / 500) + 1;
    const damageDealt = Math.floor(Math.random() * ((player.attack * 1.2) - (player.attack * .8)) + (player.attack * .8));
    const damageTaken = Math.floor(Math.random() * ((mob.attack * 1.2) - (mob.attack * .8)) + (mob.attack * .8));
    //deal damage
    mob.hp = mob.hp - damageDealt;

    //populate mob hp bar
    updateMobHp(mob);

    //earn xp
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
    //unsubscribe from old subscription
    zoneSubscription.unsubscribe(`/game/zone/1`);

    //change zones 
    if (player.position.y < 2) {
        zone++;
        player.position.y = 16;
    } else {
        zone--;
        player.position.y = 1;
    }

    //subscribe to new zone and update board.
    zoneSubscription = stompClient.subscribe(`/game/zone/${zone}`, function (location) {
        receiveGameUpdate(JSON.parse(location.body));
    });

    //update the board
    getCurrentBoard(zone);
}

function trigger_beep() {
    let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    sound.play();
}

function getCurrentBoard(zone) {

    $.ajax({
        url: `\\assets\\boards\\zone${zone}.txt`,
        success: (data) => {
            boardState = data.split(/\r\n|\r|\n/g);
            currentMap = boardState.map((x) => x);
            updateBoard(boardState);
            populateMobs();
        }
    })
}

function populateMobs() {
    mobs = [];
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
    document.getElementById("xpScore").innerHTML = `XP: ${player.xp}`;
    $.ajax({
        url: `/updatexp/${xp}`,
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

    //mob hp
    var g = document.createElement("progress");
    g.setAttribute("id", "mobPBar");
    g.setAttribute("value", `${20}`);
    g.setAttribute("max", `${20}`);
    g.setAttribute("min", 0);
    document.getElementById("mobHpBar").appendChild(g);
}

function updateHealth(hp) {
    player.currentHp += hp;
    if (player.currentHp > player.hp) {
        player.currentHp = player.hp;
    }
    if (player.currentHp < 1) {
        updateXp(-100);
        player.isDead = true;
        var username = $("#username").text();
        var message = `[SERVER]:   ${username} clearly sucks at this game! Get gooder!`
        stompClient.send("/app/userTexts", {}, JSON.stringify({ 'message': message }));
        $("#gameBoardContainer").css("background-color", "red");
        $(".boardString").css("opacity", ".2")
        $(".deathDiv").show();
        $("#deathNote").show();
        $("#deathButton").show();
    }
    document.getElementById("pBar").setAttribute("value", player.currentHp);
}

function updateMobHp(mob) {
    document.getElementById("mobPBar").setAttribute("value", mob.hp);
}

$(".deathDiv").hide();
$("#deathNote").hide();
$("#deathButton").hide();

$("#deathButton").click(function () {
    $("#pBar").remove();
    setPlayerStats();
    player.isDead = false;
    $("#gameBoardContainer").css("background-color", "");
    $(".boardString").css("opacity", "")
    $(".deathDiv").hide();
    $("#deathNote").hide();
    $("#deathButton").hide();
    updateHealth(player.hp);
});

