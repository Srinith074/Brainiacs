const market = {
  React: { demand: 85, trend: "rising" },
  Node: { demand: 80, trend: "stable" },
  Python: { demand: 90, trend: "rising" },
  Java: { demand: 70, trend: "declining" },
};

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

// 🔥 SIMPLE, VISIBLE FORMULA
// score = demand * trendMultiplier * levelWeight

function analyze(profile) {
  const results = profile.skills.map((s) => {
    const m = market[s.name] || { demand: 50, trend: "stable" };

    const score =
      m.demand *
      trendMultiplier(m.trend) *
      levelWeight(s.level);

    return {
      ...s,
      demand: m.demand,
      trend: m.trend,
      score,
    };
  });

  const total = results.reduce((a, b) => a + b.score, 0);

  return results.map((r) => {
    const allocation = ((r.score / total) * profile.hours).toFixed(1);

    return {
      ...r,
      allocation,
      risk:
        r.trend === "declining"
          ? "high"
          : r.trend === "rising"
          ? "low"
          : "medium",
      reward:
        r.trend === "rising"
          ? "long-term"
          : "short-term",
      reason: `High demand (${r.demand}) with ${r.trend} trend.`,
    };
  });
}

module.exports = { analyze };
