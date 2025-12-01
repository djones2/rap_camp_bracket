import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Results() {
  const [allBrackets, setAllBrackets] = useState([]);

  useEffect(() => {
    async function fetchBrackets() {
      const querySnapshot = await getDocs(collection(db, "brackets"));
      setAllBrackets(querySnapshot.docs.map(doc => doc.data()));
    }
    fetchBrackets();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      {allBrackets.map((b, i) => (
        <pre key={i}>{JSON.stringify(b, null, 2)}</pre>
      ))}
    </div>
  );
}
