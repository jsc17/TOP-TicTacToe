const gameboard = (function () {
  const _board = [];

  for (let row = 0; row <= 2; row++) {
    _board[row] = [];
    for (let col = 0; col <= 2; col++) {
      _board[row].push(square());
    }
  }

  const display = () => {
    let result = "";
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++) {
        result += _board[row][col].getValue();
      }
      result += "\n";
    }
    console.log(result);
  };

  const setSquare = (row, col, player) => {
    _board[row][col].setValue(player);
  };

  const getSquare = (row, col) => {
    return _board[row][col].getValue();
  };

  const reset = () => {
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++) {
        _board[row][col].setValue("-");
      }
    }
  };
  return { display, setSquare, getSquare, reset };
})();

function square() {
  let value = "-";

  const setValue = (player) => {
    value = player;
  };
  const getValue = () => {
    return value;
  };

  return { setValue, getValue };
}

function player(name, token) {
  let _token = token;
  let _name = name;

  const getToken = () => {
    return _token;
  };

  const getName = () => {
    return _name;
  };

  return { getToken, getName };
}

const game = (function () {
  const _player1 = player("player1", "x");
  const _player2 = player("player2", "O");
  let _currentPlayer = _player1;
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

  const _swapCurrentPlayer = () => {
    return _currentPlayer == _player1
      ? (_currentPlayer = _player2)
      : (_currentPlayer = _player1);
  };

  const _checkWinner = () => {
    //check rows for victory
    for (row = 0; row <= 2; row++) {
      if (
        gameboard.getSquare(row, 0) != "-" &&
        gameboard.getSquare(row, 0) == gameboard.getSquare(row, 1) &&
        gameboard.getSquare(row, 0) == gameboard.getSquare(row, 2)
      ) {
        _winner = _currentPlayer;
      }
    }
    //check columns for victory
    for (col = 0; col <= 2; col++) {
      if (
        gameboard.getSquare(0, col) != "-" &&
        gameboard.getSquare(0, col) == gameboard.getSquare(1, col) &&
        gameboard.getSquare(0, col) == gameboard.getSquare(2, col)
      ) {
        _winner = _currentPlayer;
      }
    }
    //check diagonals for victory
    if (
      gameboard.getSquare(0, 0) != "-" &&
      gameboard.getSquare(0, 0) == gameboard.getSquare(1, 1) &&
      gameboard.getSquare(0, 0) == gameboard.getSquare(2, 2)
    ) {
      _winner = _currentPlayer;
    }
    if (
      gameboard.getSquare(2, 0) != "-" &&
      gameboard.getSquare(2, 0) == gameboard.getSquare(1, 1) &&
      gameboard.getSquare(2, 0) == gameboard.getSquare(0, 2)
    ) {
      _winner = _currentPlayer;
    }
  };

  const play = () => {
    gameboard.display();
    while (_winner == null) {
      let input = _getPlayerInput();
      gameboard.setSquare(
        Math.floor(input / 3),
        input % 3,
        _currentPlayer.getToken()
      );
      _checkWinner();
      if (_winner == null) _swapCurrentPlayer();
      gameboard.display();
    }
    console.log(_winner.getName());
  };
  gameboard.reset();
  return { play };
})();

document.querySelector("#start").addEventListener("click", function () {
  game.play();
});
