import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import tracksData from "../tracks.json";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";


function createMatchups(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 2) {
    pairs.push({ a: list[i], b: list[i + 1], winner: null });
  }
  return pairs;
}

export default function Bracket() {
  const [round, setRound] = useState(1);
  const [matchups, setMatchups] = useState(createMatchups(tracksData));
  const [user, setUser] = useState(undefined); // undefined while loading
  const [rounds, setRounds] = useState([]); // store picks per round
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) setUser(result.user);
      })
      .catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div className="p-10">Loading user info...</div>;
  if (!user)
    return (
      <div className="p-10">
        <p>Not signed in.</p>
        <button
          onClick={() => signInWithRedirect(auth, provider)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    );

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

    setRounds((prev) => [...prev, winners]);

    if (winners.length === 1) {
      const roundsObj = {};
      [...rounds, winners].forEach((roundArr, idx) => {
        roundsObj[`round${idx + 1}`] = roundArr;
      });

      try {
        await addDoc(collection(db, "brackets"), {
          userId: user.uid,
          userName: user.displayName || user.email || "Anonymous",
          rounds: winners, // <-- directly
          timestamp: Date.now(),
        });

        alert(`Bracket finished! Winner: ${winners[0]}`);
        navigate("/results"); // <--- automatically go to results page
      } catch (e) {
        console.error("Error saving bracket:", e);
        alert("Error saving bracket");
      }
      return;
    }

    setMatchups(createMatchups(winners));
    setRound((r) => r + 1);
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Round {round}</h1>
      <div className="text-sm text-gray-600">
        User: {user.displayName || user.email || "Anonymous"}
      </div>

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
      <button
        onClick={() => navigate("/results")}
        className="mt-4 ml-4 p-3 bg-green-600 text-white rounded"
      >
        View Results
      </button>
    </div>
  );
}
