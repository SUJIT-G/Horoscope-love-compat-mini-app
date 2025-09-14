require("dotenv").config();  
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegram(process.env.BOT_TOKEN; 
const API_BASE = "WEBHOOK_URL";

// Horoscope Command
bot.command("horoscope", async (ctx) => {
  const input = ctx.message.text.split(" ")[1];
  if (!input) return ctx.reply("♈ Usage: /horoscope aries");

  try {
    const res = await axios.get(`${API_BASE}/api/horoscope?sign=${input}`);
    ctx.reply(`♑ Horoscope for ${res.data.sign}:\n${res.data.text}`);
  } catch {
    ctx.reply("❌ Invalid sign or error fetching horoscope.");
  }
});

// Compatibility Command
bot.command("compatibility", async (ctx) => {
  const parts = ctx.message.text.split(" ");
  if (parts.length < 3) {
    return ctx.reply("💞 Usage: /compatibility aries leo");
  }
  const [ , sign1, sign2 ] = parts;

  try {
    const res = await axios.get(`${API_BASE}/api/compatibility?sign1=${sign1}&sign2=${sign2}`);
    ctx.reply(`💘 Compatibility between ${sign1} & ${sign2}:\nScore: ${res.data.score}%\n${res.data.description}`);
  } catch {
    ctx.reply("❌ Error fetching compatibility.");
  }
});

bot.launch();
console.log("🤖 Bot started");
