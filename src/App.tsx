import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface Move {
  from: number;
  to: number;
}

const App: React.FC = () => {
  const [numDisks, setNumDisks] = useState(3);
  const [moves, setMoves] = useState<Move[]>([]);
  const [step, setStep] = useState(0);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800); // velocidade em ms
  const intervalRef = useRef<number | null>(null);


  
// Função recursiva

  const hanoi = (n: number, from: number, aux: number, to: number, result: Move[]) => {
    if (n === 1) {
      result.push({ from, to });
      return;
    }
    hanoi(n - 1, from, to, aux, result);
    result.push({ from, to });
    hanoi(n - 1, aux, from, to, result);
  };

//

  const startSimulation = () => {
    const result: Move[] = [];
    hanoi(numDisks, 0, 1, 2, result);
    setMoves(result);
    setStep(0);
    setTowers([
      Array.from({ length: numDisks }, (_, i) => numDisks - i),
      [],
      [],
    ]);
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const nextStep = () => {
    if (step < moves.length) {
      executeMove(moves[step]);
      setStep((prev) => prev + 1);
    }
  };

  const executeMove = (move: Move) => {
    setTowers((prev) => {
      const newTowers = prev.map((t) => [...t]);
      const disk = newTowers[move.from].pop();
      if (disk !== undefined) newTowers[move.to].push(disk);
      return newTowers;
    });
  };

  useEffect(() => {
    if (!isRunning || step >= moves.length) return;

    intervalRef.current = window.setTimeout(() => {
      executeMove(moves[step]);
      setStep((prev) => prev + 1);
    }, speed);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, step, moves, speed]);

  return (
    <>
    <div className="app-container">
        <h1>🏗️ Torres de Hanoi</h1>

        <div style={{ marginBottom: "20px" }} className="controls">
          <label>Discos: </label>
          <input
            type="number"
            value={numDisks}
            onChange={(e) => setNumDisks(Number(e.target.value))}
            min={1}
            max={7} 
            onKeyDown={(e) => e.preventDefault()}
            />

          <button onClick={startSimulation}>🔁 Iniciar</button>
          <button onClick={togglePause}>
            {isRunning ? "⏸️ Pausar" : "▶️ Retomar"}
          </button>
          <button onClick={nextStep}>⏭️ Avançar</button>

          <div style={{ marginTop: "10px" }}>
            <label>Velocidade: </label>
            <input
              type="range"
              min="200"
              max="1500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} />{" "}
            {speed} ms
          </div>
        </div>

        <div className="towers">
          {towers.map((tower, index) => (
            <div key={index} className="tower">
              {tower.map((disk) => (
                <div
                  key={disk}
                  className="disk"
                  style={{ width: `${40 + disk * 15}px` }}
                >
                  {disk}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p>
          Passo {step}/{moves.length}
        </p>

        <h3>🪜 Sequência de movimentos:</h3>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            margin: "0 auto",
            width: "60%",
            textAlign: "left",
            backgroundColor: "#201f1fff",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          {moves.map((m, i) => (
            <div
              key={i}
              style={{
                color: i < step ? "green" : "gray",
                fontWeight: i < step ? "bold" : "normal",
              }}
            >
              {i + 1}. Mover disco de <b>{m.from + 1}</b> → <b>{m.to + 1}</b>
            </div>
          ))}
        </div>
      </div>
      </>
  );
};

export default App;
