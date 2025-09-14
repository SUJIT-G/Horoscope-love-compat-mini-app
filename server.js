const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = process.env.WEBHOOK_URL; 
const apiResp = await axios.post(

// Set webhook (call only once after deploy)
app.get("/set-webhook", async (req, res) => {
  try {
    const resp = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}/webhook`
    );
    res.send(resp.data);
  } catch (err) {
    res.send(err.message);
  }
});

// ✅ Telegram webhook endpoint
app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  if (message && message.text) {
    const chatId = message.chat.id;
    const userMsg = message.text.toLowerCase().trim();

    // Zodiac signs list
    const zodiacSigns = [
      "aries","taurus","gemini","cancer","leo","virgo",
      "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
    ];

    let reply = "🌌 Send me your zodiac sign (e.g. Aries, Taurus, Leo)...";

    if (zodiacSigns.includes(userMsg)) {
      try {
        const apiResp = await axios.post(
          `https://aztro.sameerkumar.website/?sign=${userMsg}&day=today`
        );
        const data = apiResp.data;
        const apiResp = await axios.post(
  `https://aztro.sameerkumar.website/?sign=${userMsg}&day=today`,
  {},
  { timeout: 5000 }
);

        reply = `♈ ${userMsg.charAt(0).toUpperCase() + userMsg.slice(1)} Horoscope:\n\n`
          + `📅 ${data.current_date}\n`
          + `✨ ${data.description}\n\n`
          + `💖 Compatibility: ${data.compatibility}\n`
          + `😊 Mood: ${data.mood}\n`
          + `🎨 Lucky Color: ${data.color}\n`
          + `🔢 Lucky Number: ${data.lucky_number}\n`
          + `⏰ Lucky Time: ${data.lucky_time}`;
      } catch (error) {
        reply = "⚠️ Sorry, horoscope API is not available right now. Try again later.";
      }
    }

    // Send message back to Telegram
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply,
    });
  }

  res.sendStatus(200);
});

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

