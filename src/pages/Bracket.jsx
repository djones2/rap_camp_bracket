import { useState } from "react";
import tracksData from "../tracks.json";

import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

// Call when user finishes bracket
async function saveBracket() {
  if (!auth.currentUser) return alert("Please log in");
  const userId = auth.currentUser.uid;
  await setDoc(doc(db, "brackets", userId), { round, matchups });
  alert("Bracket saved!");
}

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

  function pickWinner(index, winner) {
    const newMatchups = [...matchups];
    newMatchups[index].winner = winner;
    setMatchups(newMatchups);
  }

  function nextRound() {
    const winners = matchups.map((m) => m.winner);
    if (winners.includes(null)) {
      alert("Please pick all winners!");
      return;
    }
    if (winners.length === 1) {
      alert(`Bracket finished! Winner: ${winners[0]}`);
      return;
    }
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
      <button onClick={nextRound} className="mt-4 p-3 bg-blue-600 text-white rounded">
        Next Round
      </button>
    </div>
  );
}
