import { useState } from "react";
import axios from "axios";

export default function Profile() {
  const [skills, setSkills] = useState([]);
  const [hours, setHours] = useState(10);

  const addSkill = () => {
    setSkills([...skills, { name: "", level: "beginner" }]);
  };

  const save = async () => {
    await axios.post("http://localhost:4000/profile", {
      userId: 1,
      data: { skills, hours },
    });
    alert("Saved");
  };

  return (
    <div>
      <h2>Profile</h2>

      {skills.map((s, i) => (
        <div key={i}>
          <input
            placeholder="Skill"
            onChange={(e) => {
              const copy = [...skills];
              copy[i].name = e.target.value;
              setSkills(copy);
            }}
          />
          <select
            onChange={(e) => {
              const copy = [...skills];
              copy[i].level = e.target.value;
              setSkills(copy);
            }}
          >
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </div>
      ))}

      <button onClick={addSkill}>Add Skill</button>

      <div>
        Weekly Hours:
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>

      <button onClick={save}>Save</button>
    </div>
  );
}
