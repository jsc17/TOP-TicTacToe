const gameboard = (function () {
  const _board = [];

  for (let index = 0; index < 9; index++) {
    _board.push("-");
  }

  const setSquare = (index, player) => {
    _board[index] = player;
    displayController.setCell(index, player);
  };

  const getSquare = (index) => {
    return _board[index];
  };

  const reset = () => {
    for (let index = 0; index < 9; index++) {
      _board[index] = "-";
      displayController.setCell(index, "-");
    }
  };
  return { setSquare, getSquare, reset };
})();

function player(name, token, id) {
  let _playerId = id;
  let _token = token;
  let _name = name;
  let _score = 0;

  const getToken = () => {
    return _token;
  };

  const getName = () => {
    return _name;
  };

  const getId = () => {
    return _playerId;
  };
  const setName = (name) => {
    _name = name;
  };

  const addPoint = () => {
    _score++;
    return _score;
  };

  return { getToken, getName, getId, setName, addPoint };
}

const game = (function () {
  const _playerList = [player("Player 1", "x", 0), player("Player 2", "o", 1)];
  let _currentPlayer = _playerList[0];
  let _winner = null;

  const _getPlayerInput = () => {
    let input = 0;
    while (input < 1 || input > 9) {
      input = parseInt(
        prompt(_currentPlayer.getName() + " please enter a square 1-9")
      );
    }
    return input - 1;
  };

  const setPlayerName = (id, newName) => {
    _playerList[id].setName(newName);
  };

  const _swapCurrentPlayer = () => {
    return _currentPlayer == _playerList[0]
      ? (_currentPlayer = _playerList[1])
      : (_currentPlayer = _playerList[0]);
  };

  const _checkWinner = () => {
    //check rows for victory
    for (let index = 0; index <= 6; index = index + 3) {
      if (
        gameboard.getSquare(index) != "-" &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 1) &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 2)
      ) {
        _winner = _currentPlayer;
      }
    }
    //check columns for victory
    for (let index = 0; index <= 2; index++) {
      if (
        gameboard.getSquare(index) != "-" &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 3) &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 6)
      ) {
        _winner = _currentPlayer;
      }
    }
    //check diagonals for victory
    if (
      gameboard.getSquare(0) != "-" &&
      gameboard.getSquare(0) == gameboard.getSquare(4) &&
      gameboard.getSquare(0) == gameboard.getSquare(8)
    ) {
      _winner = _currentPlayer;
    }
    if (
      gameboard.getSquare(6) != "-" &&
      gameboard.getSquare(6) == gameboard.getSquare(4) &&
      gameboard.getSquare(6) == gameboard.getSquare(2)
    ) {
      _winner = _currentPlayer;
    }
    if (_winner != null) {
      displayController.setMessage(_currentPlayer.getName() + " Wins!");
      score = _currentPlayer.addPoint();
      displayController.setScore(_currentPlayer.getId(), score);
    }
    if (_winner == null) {
      let filled = 0;
      for (let index = 0; index <= 8; index++) {
        if (gameboard.getSquare(index) != "-") {
          filled++;
        }
      }
      if (filled == 9) {
        _winner = "tie";
        displayController.setMessage(
          "The game is a tie! Who would have guessed."
        );
      }
    }
  };

  const makeMove = (index) => {
    if (_winner == null) {
      if (gameboard.getSquare(index) != "-") {
        displayController.setMessage(
          "Invalid Move - " +
            _currentPlayer.getName() +
            "'s turn - " +
            _currentPlayer.getToken()
        );
      } else {
        gameboard.setSquare(index, _currentPlayer.getToken());
        _checkWinner();
        _swapCurrentPlayer();
        if (_winner == null) {
          displayController.setMessage(
            _currentPlayer.getName() + "'s turn - " + _currentPlayer.getToken()
          );
        }
      }
    }
  };

  const reset = () => {
    gameboard.reset();
    _winner = null;
    _currentPlayer = _playerList[0];
    displayController.setMessage(
      _currentPlayer.getName() + "'s turn - " + _currentPlayer.getToken()
    );
  };

  //used to play in console for testing
  const play = () => {
    gameboard.display();
    while (_winner == null) {
      let input = _getPlayerInput();
      gameboard.setSquare(input, _currentPlayer.getToken());
      _checkWinner();
      if (_winner == null) {
        _swapCurrentPlayer();
      }
      gameboard.display();
    }
    console.log(_winner.getName());
    gameboard.reset();
    _winner = null;
  };

  return { play, makeMove, reset, setPlayerName };
})();

const displayController = (function () {
  _uiBoard = document.querySelector("#gameboard");
  _uiMessage = document.querySelector("#message");
  _uiCells = [];
  _uiPlayerNames = document.querySelectorAll(".player-name");
  _uiPlayerScores = document.querySelectorAll(".player-score");

  for (let index = 0; index <= 8; index++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", index);
    cell.innerText = gameboard.getSquare(index);
    cell.addEventListener("click", function () {
      game.makeMove(cell.getAttribute("data-id"));
    });
    _uiCells.push(cell);
    _uiBoard.appendChild(cell);
  }

  document.querySelector("#reset").addEventListener("click", function () {
    game.reset();
  });

  _uiPlayerNames.forEach((player) => {
    player.addEventListener("click", function () {
      newName = prompt("Enter player name: ");
      if (newName != null) {
        game.setPlayerName(player.getAttribute("data-id"), newName);
        player.innerText = newName;
      }
    });
  });

  const setCell = (index, value) => {
    _uiCells[index].innerText = value;
  };

  const setMessage = (message) => {
    _uiMessage.innerText = message;
  };

  const setScore = (playerId, score) => {
    _uiPlayerScores[playerId].innerText = score;
  };

  return { setCell, setMessage, setScore };
})();
