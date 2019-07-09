// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[6,4,2]
]

var turn = 0;

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}


// function setMessage(str) {
//   message.innerHTML = str
// }

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
   var winner = false;
   var board = {}

   // create board
   $('td').text((index, square) => board[index] = square);

   WIN_COMBINATIONS.forEach(position => {
     if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]]
     && board[position[0]] !== "") {
         setMessage(`Player ${board[position[0]]} Won!`)
         return winner = true;
       }
   })
     return winner;
}
