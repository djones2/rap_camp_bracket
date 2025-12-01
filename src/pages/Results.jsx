import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Results() {
  const [allBrackets, setAllBrackets] = useState([]);
  const [aggregate, setAggregate] = useState({});

  useEffect(() => {
    async function fetchBrackets() {
      const querySnapshot = await getDocs(collection(db, "brackets"));
      const brackets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllBrackets(brackets);

      // Aggregate votes per round
      const agg = {};
      brackets.forEach(b => {
        b.rounds.forEach((round, roundIndex) => {
          round.forEach(track => {
            if (!agg[roundIndex]) agg[roundIndex] = {};
            agg[roundIndex][track] = (agg[roundIndex][track] || 0) + 1;
          });
        });
      });
      setAggregate(agg);
    }

    fetchBrackets();
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Bracket Results</h1>

      {/* Individual brackets */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All User Brackets</h2>
        {allBrackets.length === 0 && <p>No brackets submitted yet.</p>}
        {allBrackets.map(b => (
          <div key={b.id} className="mb-4 p-4 border rounded shadow-sm">
            <h3 className="font-semibold mb-2">User: {b.id}</h3>
            {b.rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="mb-2">
                <span className="font-medium">Round {roundIndex + 1}: </span>
                {round.join(", ")}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Aggregated results */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Aggregated Results</h2>
        {Object.keys(aggregate).length === 0 && <p>No votes to aggregate yet.</p>}
        {Object.keys(aggregate).map(roundIndex => (
          <div key={roundIndex} className="mb-4">
            <h3 className="font-semibold mb-2">Round {parseInt(roundIndex) + 1}</h3>
            <ul className="list-disc list-inside">
              {Object.entries(aggregate[roundIndex])
                .sort((a, b) => b[1] - a[1]) // sort descending by votes
                .map(([track, count]) => (
                  <li key={track}>
                    {track}: {count} vote{count > 1 ? "s" : ""}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Link back home */}
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Back Home
      </a>
    </div>
  );
}
