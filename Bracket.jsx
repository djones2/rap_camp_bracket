import { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import tracksData from "../tracks.json"; // JSON from Spotify import

export default function Bracket() {
  const [user] = useAuthState(auth);
  const [round, setRound] = useState(1);
  const [matchups, setMatchups] = useState(createMatchups(tracksData));

  function createMatchups(list) {
    const pairs = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push({ a: list[i], b: list[i + 1], winner: null });
    }
    return pairs;
  }

  async function saveRound() {
    if (!user) return;
    await setDoc(
      doc(db, "brackets", user.uid),
      { [`round${round}`]: matchups.map((m) => m.winner) },
      { merge: true }
    );
  }

  function advance() {
    saveRound();
    const winners = matchups.map((m) => m.winner);
    if (winners.length === 1) return; // finished
    setMatchups(createMatchups(winners));
    setRound(round + 1);
  }

  function pickWinner(index, winner) {
    const newMatchups = [...matchups];
    newMatchups[index].winner = winner;
    setMatchups(newMatchups);
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Round {round}</h1>
      {matchups.map((m, i) => (
        <div key={i} className="flex space-x-4">
          <button
            onClick={() => pickWinner(i, m.a)}
            className={`p-2 border rounded ${
              m.winner === m.a ? "bg-green-300" : ""
            }`}
          >
            {m.a}
          </button>
          <span>vs</span>
          <button
            onClick={() => pickWinner(i, m.b)}
            className={`p-2 border rounded ${
              m.winner === m.b ? "bg-green-300" : ""
            }`}
          >
            {m.b}
          </button>
        </div>
      ))}
      <button
        onClick={advance}
        className="mt-4 p-3 bg-blue-600 text-white rounded"
      >
        Next Round
      </button>
    </div>
  );
}
