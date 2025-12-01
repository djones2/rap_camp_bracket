import { useState } from "react";
import tracksData from "../tracks.json";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function createMatchups(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 2) {
    pairs.push({ a: list[i], b: list[i + 1], winner: null });
  }
  return pairs;
}

export default function Bracket() {
  if (!tracksData || !Array.isArray(tracksData)) return <div>No tracks loaded</div>;

  const [round, setRound] = useState(1);
  const [matchups, setMatchups] = useState(createMatchups(tracksData));
  const [allRounds, setAllRounds] = useState([]); // store all rounds
  const [finished, setFinished] = useState(false);

  function pickWinner(index, winner) {
    const newMatchups = [...matchups];
    newMatchups[index].winner = winner;
    setMatchups(newMatchups);
  }

  async function nextRound() {
    const winners = matchups.map((m) => m.winner);
    if (winners.includes(null)) {
      alert("Please pick all winners!");
      return;
    }

    // Save this round to allRounds
    setAllRounds([...allRounds, winners]);

    if (winners.length === 1) {
      alert(`Bracket finished! Winner: ${winners[0]}`);
      setFinished(true);

      // Save bracket to Firebase
      try {
        await addDoc(collection(db, "brackets"), {
          rounds: [...allRounds, winners],
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Error saving bracket:", err);
      }

      return;
    }

    // Prepare next round matchups
    setMatchups(createMatchups(winners));
    setRound(round + 1);
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Round {round}</h1>
      {matchups.map((m, i) => (
        <div key={i} className="flex items-center space-x-4">
          <button
            onClick={() => pickWinner(i, m.a)}
            className={`p-2 border rounded ${m.winner === m.a ? "bg-green-300" : ""}`}
          >
            {m.a}
          </button>
          <span className="font-bold">vs</span>
          <button
            onClick={() => pickWinner(i, m.b)}
            className={`p-2 border rounded ${m.winner === m.b ? "bg-green-300" : ""}`}
          >
            {m.b}
          </button>
        </div>
      ))}

      {!finished && (
        <button onClick={nextRound} className="mt-4 p-3 bg-blue-600 text-white rounded">
          Next Round
        </button>
      )}

      {finished && (
        <a
          href="/results"
          className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded"
        >
          View All Results
        </a>
      )}
    </div>
  );
}
