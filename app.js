// Initialize values
// =================
var rows = cols = 8;
var diff = 1;
var gameover = false;

// Locations start with 1 in upper left cell and sequentially increase going right 
// then continuing on the subsequent rows
var bombs = getBombs(rows, cols, diff);
var cells = allCells(rows,cols).filter(checkForNoBomb);
var picked = [];
var hint = bombs.slice(0);
var gridCallback = function(el,row,col,i) {
    if (gameover || !el || el.className == 'clicked') return;
    el.className='clicked';
    if (bombs.indexOf(i) > -1) {
      el.innerHTML = 'x';
      document.getElementById("status").innerHTML = "Sorry you lose. Try again.";
      gameover = true;
    } else {
      var adj = getAdjacent(row,col);
      if (adj.count == 0) {
          el.innerHTML = '';
          adj.data.forEach(checkAdjacent); 
      } else { el.innerHTML = adj.count; }
      picked.push(i);
    }
};

// Main part setting up the board
var board = clickableGrid(rows,cols,gridCallback);
document.body.appendChild(board);

// Listeners for button press
document.getElementById("new").addEventListener('click', resetBoard);
document.getElementById("validate").addEventListener('click', validateBoard);
document.getElementById("hint").addEventListener('click', giveHint);

// Functions
// =================
function allCells(r,c) { return Array.from(new Array(rows*cols), (x,i) => i+1); }

function checkForNoBomb(c) { return bombs.indexOf(c) == -1; }

// Using 10/64 as a guideline for medium difficulty game
function numberOfBombs(r, c, d) { return (r * c * ((d < 1 ? .5 : d) * .15625)).toFixed(); }
 
function giveHint() {
    if (hint.length > 0) {
        var el = document.getElementById("cell"+hint.pop());
        el.className='hint';
    } else {
        document.getElementById("status").innerHTML = "All hints given.";
    }
}

function checkAdjacent(item) {
    var el = document.getElementById("cell" + item.i);
    gridCallback(el,item.row,item.col,item.i);
}

function validateBoard() {
    if (cells.length == picked.length) {
        document.getElementById("status").innerHTML = "Congratulations, you win!";
    } else {
        document.getElementById("status").innerHTML = "Sorry you lose. Try again.";
    }
    gameover = true;
}

function getAdjacent(row,col) {
    var data = [];
    var count = 0;
    for (var r=row-1;r<=row+1;++r) {
        for (var c=col-1;c<=col+1;++c) {
            if ((r == row && c == col) ||
                (r < 0) || (c < 0) || (c >= cols)) {
                continue;
            }
            var i = r*cols + c+1
            data.push({row: r, col: c, i: i});
            if (bombs.indexOf(i) > -1) count += 1;
        }
    }
    return {
        count: count,
        data: data
    };
}

function getBombs(r,c,d) {
    var bombs = [];
    var b = numberOfBombs(r,c,d);
    while (bombs.length < b) {
        var rand = Math.floor(Math.random() * (r*c)) + 1;
        if (bombs.indexOf(rand) > -1) continue;
        bombs[bombs.length] = rand;
    }
    return bombs;
}

function clickableGrid( rows, cols, callback ){
    var i=0;
    var board = document.createElement('table');
    board.className = 'board';
    for (var r=0;r<rows;++r){
        var tr = board.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            cell.id = "cell" + ++i;
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return board;
}

function resetBoard() {
    rows = document.getElementById("rows").value;
    cols = document.getElementById("cols").value;
    diff = document.getElementById("diff").value;
    bombs = getBombs(rows, cols, diff);
    cells = allCells(rows,cols).filter(checkForNoBomb);
    picked = [];
    hint = bombs.slice(0);

    var newboard = clickableGrid(rows,cols,gridCallback);
    document.body.replaceChild(newboard, board);
    board = newboard;
    document.getElementById("status").innerHTML = "";
    gameover = false;
}

function redrawBoard() {
    resetBoard();
    document.getElementById("status").innerHTML = "Configuration has changed. Start a new game.";
    gameover = true;
}

function updateRanges() {
    r.value=parseInt(document.getElementById("rows").value);
    c.value=parseInt(document.getElementById("cols").value);
    d.value=parseInt(document.getElementById("diff").value);
}
