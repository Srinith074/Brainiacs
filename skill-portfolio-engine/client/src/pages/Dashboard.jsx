import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const profile = await axios.get(
        "http://localhost:4000/profile/1"
      );

      const res = await axios.post(
        "http://localhost:4000/analysis",
        profile.data
      );

      setData(res.data);
    }

    load();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {data.map((d, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 8 }}>
          <h3>{d.name}</h3>
          <p>Allocation: {d.allocation} hrs/week</p>
          <p>Risk: {d.risk}</p>
          <p>Reward: {d.reward}</p>
          <p><b>Why?</b> {d.reason}</p>
        </div>
      ))}
    </div>
  );
}
