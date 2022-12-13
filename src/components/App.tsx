import cn from "classnames";
import { useEffect, useMemo } from "react";
import { NUM_GUESSES } from "../consts";
import { getAllWordsGuessed } from "../funcs";
import { addDebugHooks, useSelector } from "../store";
import About from "./About";
import Boards from "./Boards";
import Header from "./Header";
import Keyboard from "./Keyboard";
import LocalStorage from "./LocalStorage";
import Result from "./Result";
import { Settings } from "./Settings";
import Stats from "./Stats";
// @ts-ignore
import youDidItMovie from "../assets/you-did-it.mp4";

export default function App() {
  const targets = useSelector((s) => s.game.targets);
  const guesses = useSelector((s) => s.game.guesses);
  const guessesUsedUp = guesses.length === NUM_GUESSES;
  const gameWin = useMemo(
    () => getAllWordsGuessed(targets, guesses),
    [targets, guesses]
  );
  const gameOver = guessesUsedUp || gameWin;
  const gameLose = guessesUsedUp && !gameWin;
  const colorBlindMode = useSelector((s) => s.settings.colorBlindMode);
  const wideMode = useSelector((s) => s.settings.wideMode);
  const hideCompletedBoards = useSelector(
    (s) => s.settings.hideCompletedBoards
  );
  const animateHiding = useSelector((s) => s.settings.animateHiding);

  useEffect(() => {
    addDebugHooks();
  }, []);

  return (
    <div
      className={cn(
        "game",
        gameWin && "win",
        gameLose && "lose",
        colorBlindMode && "color-blind",
        wideMode && "wide",
        hideCompletedBoards &&
          !(gameWin || gameLose) &&
          "hide-completed-boards",
        animateHiding && "animate-hiding"
      )}
    >
      <div className="main">
        <Header />
        <Boards />
        <Keyboard hidden={gameOver} />
        <Result hidden={!gameOver} />
      </div>
      <About />
      <Settings />
      <Stats />
      <LocalStorage />
      {gameOver ? (
        <video
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            margin: "0 auto",
          }}
          controls
        >
          <source src={youDidItMovie} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
