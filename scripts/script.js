const gameboard = (function () {
  const _board = [];

  for (let index = 0; index < 9; index++) {
    _board.push("-");
  }

  const display = () => {
    let result = "";

    let index = 0;
    while (index < 9) {
      result += _board[index];
      index++;
      if (index % 3 == 0) {
        result += "\n";
      }
    }

    console.log(result);
  };

  const setSquare = (index, player) => {
    _board[index] = player;
  };

  const getSquare = (index) => {
    return _board[index];
  };

  const reset = () => {
    for (let index = 0; index < 9; index++) {
      _board[index] = "-";
    }
  };
  return { display, setSquare, getSquare, reset };
})();

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
  const _player2 = player("player2", "o");
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
    for (let index = 0; index <= 6; index = index + 3) {
      if (
        gameboard.getSquare(index) != "-" &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 1) &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 2)
      ) {
        _winner = _currentPlayer;
      }
    }
    for (let index = 0; index <= 2; index++) {
      if (
        gameboard.getSquare(index) != "-" &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 3) &&
        gameboard.getSquare(index) == gameboard.getSquare(index + 6)
      ) {
        _winner = _currentPlayer;
      }
    }
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
  };

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

  return { play };
})();

document.querySelector("#start").addEventListener("click", function () {
  game.play();
});
