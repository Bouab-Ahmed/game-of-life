import { useCallback, useRef, useState } from "react";
import produce from "immer";
import "./App.css";
const numRows = 30;
const numCols = 50;
const position = [
	[0, 1],
	[0, -1],
	[1, 1],
	[1, -1],
	[1, 0],
	[-1, 0],
	[-1, 1],
	[-1, -1],
];
function App() {
	const generateEmptyGrid = () => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => 0));
		}
		return rows;
	};
	const [grid, setGrid] = useState(() => {
		return generateEmptyGrid();
	});
	const [running, setRunning] = useState(false);
	const runningRef = useRef(running);
	runningRef.current = running;
	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}
		// simulate
		setGrid(g => {
			return produce(g, gridCopy => {
				for (let i = 0; i < numRows; i++) {
					for (let j = 0; j < numCols; j++) {
						let neighbours = 0;
						position.forEach(([x, y]) => {
							const newI = i + x;
							const newJ = j + y;
							if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
								neighbours += g[newI][newJ];
								// if (g[newI][newJ] === 1) {
								// 	neighbours++;
								// }
							}
						});
						if (neighbours < 2 || neighbours > 3) {
							gridCopy[i][j] = 0;
						} else if (g[i][j] === 0 && neighbours === 3) {
							gridCopy[i][j] = 1;
						}
					}
				}
			});
		});
		setTimeout(runSimulation, 500);
	}, []);
	return (
		<>
			<div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
				<button
					className="button"
					onClick={() => {
						setRunning(!running);
						if (!running) {
							runningRef.current = true;
							runSimulation();
						}
					}}
				>
					{running ? `Stop` : `Start`}
				</button>
				<button
					className="button"
					onClick={() => {
						const rows = [];
						for (let i = 0; i < numRows; i++) {
							rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
						}
						setGrid(rows);
					}}
				>
					Random
				</button>
				<button
					className="button"
					onClick={() => {
						setGrid(() => {
							return generateEmptyGrid();
						});
					}}
				>
					Clear
				</button>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: `repeat(${numCols},20px)`, justifyContent: "center" }}>
				{grid.map((rows, i) =>
					rows.map((col, j) => (
						<div
							key={`${i}-${j}`}
							onClick={() => {
								const newGrid = produce(grid, gridCopy => {
									gridCopy[i][j] = grid[i][j] ? 0 : 1;
								});
								setGrid(newGrid);
							}}
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[i][j] ? "#000" : undefined,
								border: "1px solid #000",
							}}
						></div>
					)),
				)}
			</div>
		</>
	);
}

export default App;
