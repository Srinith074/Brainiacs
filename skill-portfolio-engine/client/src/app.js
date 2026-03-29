const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// --- In-memory storage (simple & realistic for hackathon)
let profile = {
  skills: [],
  hours: 10,
};

// --- Fake market data
const market = {
  React: { demand: 85, trend: "rising" },
  Node: { demand: 80, trend: "stable" },
  Python: { demand: 90, trend: "rising" },
  Java: { demand: 70, trend: "declining" },
};

// --- Core Logic (visible & explainable)
function trendMultiplier(trend) {
  if (trend === "rising") return 1.2;
  if (trend === "declining") return 0.8;
  return 1;
}

function levelWeight(level) {
  return {
    beginner: 1.2,
    intermediate: 1,
    advanced: 0.7,
  }[level];
}

// score = demand × trend × level weight
function analyze(data) {
  const results = data.skills.map((s) => {
    const m = market[s.name] || { demand: 50, trend: "stable" };

    const score =
      m.demand *
      trendMultiplier(m.trend) *
      levelWeight(s.level);

    return { ...s, demand: m.demand, trend: m.trend, score };
  });

  const total = results.reduce((a, b) => a + b.score, 0);

  return results.map((r) => ({
    ...r,
    allocation: ((r.score / total) * data.hours).toFixed(1),
    risk:
      r.trend === "declining"
        ? "high"
        : r.trend === "rising"
        ? "low"
        : "medium",
    reward: r.trend === "rising" ? "long-term" : "short-term",
    recommendation:
      r.score > 80
        ? "Invest more"
        : r.score < 50
        ? "Reduce focus"
        : "Maintain",
    reason: `Demand ${r.demand} with ${r.trend} trend`,
  }));
}

// --- API
app.post("/save", (req, res) => {
  profile = req.body;
  res.send({ status: "saved" });
});

app.get("/analyze", (req, res) => {
  res.send(analyze(profile));
});

// --- Frontend (served directly)
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Skill Investment Engine</title>
    <style>
      body { font-family: Arial; background:#f5f5f5; }
      .box { background:white; padding:20px; margin:20px auto; width:600px; border:1px solid #ddd; }
      input, select { margin:5px; padding:5px; }
      button { margin-top:10px; padding:6px 10px; }
      .card { border:1px solid #ccc; margin-top:10px; padding:10px; }
    </style>
  </head>
  <body>

    <div class="box">
      <h2>Skill Profile</h2>

      <div id="skills"></div>
      <button onclick="addSkill()">Add Skill</button>

      <div>
        Weekly Hours:
        <input id="hours" type="number" value="10"/>
      </div>

      <button onclick="save()">Save</button>
      <button onclick="analyze()">Analyze</button>
    </div>

    <div class="box">
      <h2>Dashboard</h2>
      <div id="results"></div>
    </div>

    <script>
      let skills = [];

      function addSkill() {
        skills.push({ name: "", level: "beginner" });
        render();
      }

      function render() {
        const container = document.getElementById("skills");
        container.innerHTML = "";

        skills.forEach((s, i) => {
          container.innerHTML += \`
            <div>
              <input placeholder="Skill" onchange="updateName(\${i}, this.value)" />
              <select onchange="updateLevel(\${i}, this.value)">
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </div>
          \`;
        });
      }

      function updateName(i, val) {
        skills[i].name = val;
      }

      function updateLevel(i, val) {
        skills[i].level = val;
      }

      async function save() {
        await fetch("/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills,
            hours: document.getElementById("hours").value
          })
        });

        alert("Saved");
      }

      async function analyze() {
        const res = await fetch("/analyze");
        const data = await res.json();

        const container = document.getElementById("results");
        container.innerHTML = "";

        data.forEach(d => {
          container.innerHTML += \`
            <div class="card">
              <b>\${d.name}</b><br/>
              Allocation: \${d.allocation} hrs/week<br/>
              Risk: \${d.risk}<br/>
              Reward: \${d.reward}<br/>
              Recommendation: \${d.recommendation}<br/>
              <i>Why?</i> \${d.reason}
            </div>
          \`;
        });
      }
    </script>

  </body>
  </html>
  `);
});

// --- Start server
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
