const express = require("express");
const { connectToMongoDb } = require('./connect.js')
const urlRoute = require('./routes/url.js');
const url = require("./models/url.js");
const { connection } = require("mongoose");
const { handleGetAnalytics } = require("./controllers/url.js");

const app = express();
const port = 2000;

app.use(express.json());

connectToMongoDb('mongodb://127.0.0.1:27017/urlShortener')
    .then(() => {
        console.log('connected to Mongoose');
    })
    .catch((err) => {
        console.log(err);
    })

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry =await url.findOneAndUpdate(
        { 
            shortId
         }, 
         { 
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            }
        })
    res.redirect(entry.redirectUrl);
});

app.get('/url/analytics/:shortId', handleGetAnalytics)


app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
})

