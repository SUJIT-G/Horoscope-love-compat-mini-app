const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ♈ List of valid signs
const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

// 🔥 Elements mapping
const ELEMENT = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water"
};

// Compatibility base scores between elements
const ELEMENT_COMPAT = {
  fire: { fire: 80, air: 70, water: 50, earth: 55 },
  earth: { earth: 80, water: 70, air: 55, fire: 50 },
  air: { air: 80, fire: 70, earth: 55, water: 50 },
  water: { water: 80, earth: 70, air: 50, fire: 55 }
};

// Utility
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Horoscope generator
function generateHoroscope(sign) {
  const now = new Date();
  const moods = ["lucky", "challenging", "romantic", "creative", "adventurous"];
  const tips = [
    "Today is good for planning.",
    "A short walk clears your head.",
    "Say no once if you need time."
  ];

  const mood = randomFrom(moods);
  const lines = [];
  lines.push(`Your mood today: ${mood}`);
  lines.push(randomFrom(tips));

  return {
    sign,
    generated_at: now.toISOString(),
    mood,
    text: lines.join(" ")
  };
}

// ---- API ROUTES ----

// Daily Horoscope
app.get("/api/horoscope", (req, res) => {
  const sign = (req.query.sign || "").toLowerCase();
  if (!SIGNS.includes(sign)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing sign. Valid: " + SIGNS.join(", ") });
  }
  const data = generateHoroscope(sign);
  res.json(data);
});

// Love Compatibility
app.get("/api/compatibility", (req, res) => {
  const s1 = (req.query.sign1 || "").toLowerCase();
  const s2 = (req.query.sign2 || "").toLowerCase();

  if (!SIGNS.includes(s1) || !SIGNS.includes(s2)) {
    return res.status(400).json({
      error: "Invalid or missing signs. Use sign1 and sign2 query params."
    });
  }

  const e1 = ELEMENT[s1];
  const e2 = ELEMENT[s2];
  let base = ELEMENT_COMPAT[e1][e2] || 50;

  // random ±5
  const variance = Math.floor((Math.random() - 0.5) * 11);
  const score = Math.max(0, Math.min(100, base + variance));

  let desc = "";
  if (score >= 80)
    desc = "Excellent harmony — strong emotional & intellectual connection.";
  else if (score >= 65)
    desc = "Good match — plenty of shared values and understanding.";
  else if (score >= 45)
    desc = "Mixed compatibility — effort needed to bridge differences.";
  else desc = "Challenging match — needs patience and compromise.";

  res.json({ sign1: s1, sign2: s2, element1: e1, element2: e2, score, description: desc });
});

// ---- Serve Frontend ----
app.use(express.static(path.join(__dirname, "public")));

// fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

