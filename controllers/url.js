const shortid= require('shortid');

const url = require('../models/url.js');


async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error: 'url is required'});
    const shortId = shortid();
    await url.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitedHistory: [],
    });
    return res.json({id: shortId});
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