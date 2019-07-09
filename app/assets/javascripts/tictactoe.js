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
];

var turn = 0;
currentGameId = null;

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function isSquareTaken(square) {
  return !!$(square).text();
}

function updateState(square) {
  if (isSquareTaken(square)) {
    return;
  }
  $(square).text(player());
  turn++;
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


function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    saveGame();
    clearGame();
    turn = 0;
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
    turn = 0;
  };
}


$(document).ready(function() {
  attachListeners();
})

function attachListeners() {
  $("td").on("click", function() {
    doTurn(this);
  });

  $("button#save").on("click", saveGame);
  $("button#previous").on("click", previousGames);
  $("button#clear").on("click", clearGame);
}


function previousGames() {
  $.get('/games', function(response) {
    $('#games').html(response);
    var gamesList = "";
    for (var i=0; i < response.data.length; i++) {
      var game = response.data[i];
      gamesList += `<button onclick="loadGame(${game.id})">${game.id}</button>`;
    }
    $("#games").html(gamesList);
  });
}

function saveGame() {
  var state = [];

  $("td").text((index, square) => {
    state.push(square);
    return square;
  });

  var method = currentGameId ? 'PATCH' : 'POST';
  var url = currentGameId ? `/games/${currentGameId}` : '/games';

  $.ajax({
    type: method,
    data: {state: state},
    url: url,
    success: function(response) {
      currentGameId = response.data.id;
    }
  });
}

function clearGame() {
  $("td").empty();
  turn = 0;
  currentGameId = null;
}

function loadGame(id) {
  $.get(`/games/${id}`, function(response) {
    var game = response.data;
    $("td").text((index, square) => game.attributes.state[index]);
    currentGameId = game.id;
    var tokens = game.attributes.state.filter(function(spot) {
      return spot != "";
    })
    turn = tokens.length;
  });
}
