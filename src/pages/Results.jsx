import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Results() {
  const [allBrackets, setAllBrackets] = useState([]);
  const [aggregate, setAggregate] = useState({});

  useEffect(() => {
    async function fetchBrackets() {
      const querySnapshot = await getDocs(collection(db, "brackets"));
      const brackets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllBrackets(brackets);

      // Aggregate votes per round
      const agg = {};
      brackets.forEach((b) => {
        const roundsObj = b.rounds || {};
        Object.entries(roundsObj).forEach(([roundKey, picks]) => {
          if (!Array.isArray(picks)) return; // skip invalid data
          if (!agg[roundKey]) agg[roundKey] = {};
          picks.forEach((track) => {
            agg[roundKey][track] = (agg[roundKey][track] || 0) + 1;
          });
        });
      });

      // Reverse order so last round shows first
      const reversedAgg = {};
      Object.keys(agg)
        .sort((a, b) => parseInt(b.replace("round", "")) - parseInt(a.replace("round", "")))
        .forEach((key) => {
          reversedAgg[key] = agg[key];
        });

      setAggregate(reversedAgg);
    }

    fetchBrackets();
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Bracket Results</h1>

      {/* Aggregated results */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Overall Results</h2>
        {Object.keys(aggregate).length === 0 && <p>No votes to aggregate yet.</p>}
        {Object.entries(aggregate).map(([roundKey, votes]) => {
          const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
          return (
            <div key={roundKey} className="mb-6 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-2">{roundKey}</h3>
              <ul className="list-decimal list-inside">
                {sorted.map(([track, count], i) => (
                  <li key={track} className={i === 0 ? "font-bold text-green-600" : ""}>
                    {track}: {count} vote{count > 1 ? "s" : ""}
                    {i === 0 && " ⭐ Top"}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Individual user brackets */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All User Brackets</h2>
        {allBrackets.length === 0 && <p>No brackets submitted yet.</p>}
        {allBrackets.map((b) => (
          <div key={b.id} className="mb-4 p-4 border rounded shadow-sm bg-gray-50">
            <h3 className="font-semibold mb-2">User: {b.userName || "Anonymous"}</h3>
            {Object.entries(b.rounds || {}).map(([roundKey, picks]) => (
              <div key={roundKey} className="mb-1">
                <span className="font-medium">{roundKey}: </span>
                {Array.isArray(picks) ? picks.join(", ") : "Invalid data"}
              </div>
            ))}
          </div>
        ))}
      </div>

      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Back Home
      </a>
    </div>
  );
}
