function adaptive() {
    if (screen.availWidth > 450) {
        var Canvas = "<canvas id='chess' width='450px' height='450px'></canvas>";
        document.body.insertAdjacentHTML("beforeEnd", Canvas);
    } else {
        var Canvas = "<canvas id='chess' width='" + screen.availWidth + "px' height='" + screen.availWidth + "px'></canvas>";
        document.body.insertAdjacentHTML("beforeEnd", Canvas);
    }
}

adaptive()


var me = true
var over = false
var chessBoard = []

for (var i = 0; i < 15; i++) {
    chessBoard[i] = []
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = []
    }
}
//赢法数组
var wins = []

for (var i = 0; i < 15; i++) {
    wins[i] = []
    for (var j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}

var count = 0
    /*竖的5连子*/
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true
        }
        count++
    }
}
/*横的5连子*/
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true
        }
        count++
    }
}
/*斜线的5连子*/
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i + k][count] = true
        }
        count++
    }
}
/*反斜线的5连子*/
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true
        }
        count++
    }
}

//赢法的统计数组
var myWin = []
var computerWin = []

for (var i = 0; i < count; i++) {
    myWin[i] = 0
    computerWin[i] = 0
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var w = Math.floor(chess.width / 30);

var logo = new Image()
logo.src = "images/idea.png" //图片需要时间加载，所以需要onload

logo.onload = function() {
    context.drawImage(logo, 0, 0, chess.width, chess.height)
    drawChessBoard()
}


var drawChessBoard = function() {
    context.strokeStyle = '#bfbfbf';
    for (var i = 0; i < 15; i++) {
        context.moveTo(w + i * 2 * w, w)
        context.lineTo(w + i * 2 * w, 29 * w)
        context.stroke()
        context.moveTo(w, w + i * 2 * w)
        context.lineTo(29 * w, w + i * 2 * w)
        context.stroke()
    }
}

var oneStep = function(i, j, me) {
    context.beginPath()
    context.arc(w + i * 2 * w, w + j * 2 * w, 0.86 * w, 0, 2 * Math.PI)
    context.closePath()
    var gradient = context.createRadialGradient(w + i * 2 * w + 0.13 * w, w + j * 2 * w - 0.13 * w, 0.86 * w, w + i * 2 * w, w + j * 2 * w, 0)
    if (me) {
        gradient.addColorStop(0, "#0a0a0a")
        gradient.addColorStop(1, "#636766")
    } else {
        gradient.addColorStop(0, "#d1d1d1")
        gradient.addColorStop(1, "#f9f9f9")
    }
    context.fillStyle = gradient
    context.fill()
}

function windowToCanvas(e) {
    var bbox = chess.getBoundingClientRect();
    return {
        x: Math.round(e.clientX - bbox.left),
        y: Math.round(e.clientY - bbox.top)
    }
}

chess.onclick = function(e) {
    if (over) {
        return
    }
    if (!over)
        var curLoc = windowToCanvas(e);
    var x = curLoc.x;
    var y = curLoc.y;
    var i = Math.floor(x / 30)
    var j = Math.floor(y / 30)
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, me)
        chessBoard[i][j] = 1


        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++
                    computerWin[k] = 6
                if (myWin[k] == 5) {
                    window.alert("你赢了!")
                    over = true
                }
            }
        }
        if (!over) {
            me = !me
            setTimeout(computerAI, 300)

        }
    }

}

var computerAI = function() {
    var myScore = []
    var computerScroe = []
    var max = 0
    var u = 0
    var v = 0
    for (var i = 0; i < 15; i++) {
        myScore[i] = []
        computerScroe[i] = []
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScroe[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000
                        }
                        if (computerWin[k] == 1) {
                            computerScroe[i][j] += 220
                        } else if (computerWin[k] == 2) {
                            computerScroe[i][j] += 420
                        } else if (computerWin[k] == 3) {
                            computerScroe[i][j] += 2100
                        } else if (computerWin[k] == 4) {
                            computerScroe[i][j] += 20000
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j]
                    u = i
                    v = j
                } else if (myScore[i][j] == max) {
                    if (computerScroe[i][j] > computerScroe[u][v]) {
                        u = i
                        v = j
                    }
                }
                if (computerScroe[i][j] > max) {
                    max = computerScroe[i][j]
                    u = i
                    v = j
                } else if (computerScroe[i][j] == max) {
                    if (myScore[i][j] > myScore[i][j]) {
                        u = i
                        v = j
                    }
                }
            }
        }
    }

    oneStep(u, v, false)
    chessBoard[u][v] = 2
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++
                myWin[k] = 6
            if (computerWin[k] == 5) {
                window.alert("计算机赢了!")
                over = true
            }
        }
    }
    if (!over) {
        me = !me
    }
}
