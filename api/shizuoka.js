// shizuoka.js
const axios = require("axios");

// ---------- Helper ----------
const cleanText = (text) => {
  return text?.toLowerCase().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim() || "";
};

// ---------- Meta ----------
const meta = {
  name: "shizuoka",
  version: "1.0.0",
  description: "Simsimi-like chatbot API (teach + chat, proxy mode)",
  author: "Rakib Adil",
  method: "get",
  category: "chat",
  path: "/rakib?text=&uid="
};

// ---------- Handler ----------
async function onStart({ req, res }) {
  try {
    const getAPIBase = async () => {
      const base = await axios.get(
        "https://gitlab.com/Rakib-Adil-69/shizuoka-command-store/-/raw/main/apiUrls.json"
      );
      return base.data.rakib;
    };

    const rakib = await getAPIBase();
    const { text, uid } = req.query;

    if (!text || !uid) {
      return res.status(400).json({ message: "Missing text or uid" });
    }

    const query = cleanText(text);
    if (!query) {
      return res.json({ text: "Please teach me this sentence! 🦆💨" });
    }

    // Forward request to base API
    const apiRes = await axios.get(`${rakib}/rakib`, {
      params: { text: query, uid }
    });

    return res.json(apiRes.data);

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

module.exports = { meta, onStart };