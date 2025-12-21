const shortid= require('shortid');

const url = require('../models/url.js');


async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const shortId = shortid();
      await url.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitedHistory: [],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      return res.render("home", {
        id: shortId
      });

    } catch (err) {
      if (err.code === 11000) {
        attempts++;
        continue;
      }
      console.error(err);
      return res.status(500).json({ error: "server error" });
    }
  }
  return res.status(500).json({
    error: "Could not generate unique short URL"
  });
}


async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;
    const entry = await url.findOne({shortId: shortId});
    return res.json({
        totalClicks: entry.visitHistory.length,
        analytics: entry.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,

}