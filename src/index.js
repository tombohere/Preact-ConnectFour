import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import redclickURL from "./media/redclick.mmm";
import yellowclickURL from "./media/yellowclick.mmm";
import redwinURL from "./media/red.mmm";
import yellowwinURL from "./media/yellow.mmm";
import nobodyURL from "./media/nobody.mmm";

const App = () => (
  <div className="App">
    <Board />
  </div>
);

const Board = () => {
  const [game, setGame] = useState(makeBoard());

  const redclickPlay = new Audio(redclickURL);
  const yellowclickPlay = new Audio(yellowclickURL);
  const redwinPlay = new Audio(redwinURL);
  const yellowwinPlay = new Audio(yellowwinURL);
  const nobodyPlay = new Audio(nobodyURL);

  function makeBoard() {
    let board = new Array(7);
    for (let i = 0; i < board.length; i++) {
      board[i] = [];
      for (let j = 0; j < 6; j++) {
        board[i].push(0);
      }
    }
    return {
      board,
      gameStarted: false,
      player1: true,
      count: 0,
      gameOver: false,
      playerWin: 0,
      mute: false
    };
  }

  const startGame = () => setGame({ ...game, gameStarted: true });

  const restartGame = () =>
    setGame({ ...makeBoard(), gameStarted: true, mute: game.mute });

  const checkWin = () => {
    let b = game.board;
    let t;
    for (let i = 0; i < 4; i++) {
      for (let j = 5; j >= 0; j--) {
        t = b[i][j] + b[i + 1][j] + b[i + 2][j] + b[i + 3][j];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 7; i++) {
        t = b[i][j] + b[i][j + 1] + b[i][j + 2] + b[i][j + 3];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 5; j > 1; j--) {
      for (let i = 0; i < 4; i++) {
        t = b[i][j] + b[i + 1][j - 1] + b[i + 2][j - 2] + b[i + 3][j - 3];
        if (t === 4 || t === 20) return true;
        t = b[6 - i][j] + b[5 - i][j - 1] + b[4 - i][j - 2] + b[3 - i][j - 3];
        if (t === 4 || t === 20) return true;
      }
    }
    return false;
  };

  const colClick = (n) => {
    if (game.gameStarted && !game.gameOver) {
      if (!game.mute) {
        game.player1 ? redclickPlay.play() : yellowclickPlay.play();
      }
      let temp = { ...game };
      for (let i = temp.board[n].length - 1; i >= 0; i--) {
        if (temp.board[n][i] === 0) {
          temp.board[n][i] = temp.player1 ? 1 : 5;
          temp.count++;
          if (checkWin()) {
            temp.gameOver = true;
            temp.playerWin = temp.player1 ? 1 : 2;
            if (!game.mute) {
              temp.player1 ? redwinPlay.play() : yellowwinPlay.play();
            }
          } else {
            if (temp.count === 42) {
              temp.gameOver = true;
              if (!game.mute) nobodyPlay.play();
            }
            temp.player1 = !temp.player1;
          }
          setGame(temp);
          break;
        }
      }
      checkWin();
    }
  };

  const toggleSound = () => {
    setGame({ ...game, mute: !game.mute });
  };

  const playerColor = (n) =>
    ({ 0: "", 1: " player1Color", 5: " player2Color" }[n]);

  const circleClass = () =>
    ({ true: " player1Color", false: " player2Color" }[game.player1]);

  const backColor = () =>
    ({ true: " AppRed", false: " AppYellow" }[game.player1]);

  const getSound = () => ({ true: "🔇", false: "🔊" }[game.mute]);

  return (
    <div className={"App" + backColor()}>
      <div class="volume" onClick={toggleSound}>
        {getSound()}
      </div>
      <div id="board">
        <div className="board-container">
          <div />
          <div className="board-title-area">
            <div />
            <div className="board-position">
              <div className={"board-circle top-circle" + circleClass()}>
                GO
              </div>
            </div>
            <div id="board-info">CONNECT 4</div>
          </div>
          <div />
          <div className="board-game-area">
            <div />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div className="board-column" key={i} onClick={() => colClick(i)}>
                <div className="board-column-container">
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <div className="board-position" key={j}>
                      <div
                        className={
                          "board-circle" + playerColor(game.board[i][j])
                        }
                      >
                        {""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div />
          </div>
        </div>
      </div>
      {!game.gameStarted ? (
        <div className="board-message-container" onClick={startGame}>
          <div className="board-message">START</div>
        </div>
      ) : (
        ""
      )}
      {game.gameOver ? (
        <div className="board-message-container" onClick={restartGame}>
          <div className="board-message">
            {game.player1
              ? game.playerWin === 0
                ? "NOBODY"
                : "RED"
              : game.playerWin === 0
              ? "NOBODY"
              : "YELLOW"}
            <br />
            WINS
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
