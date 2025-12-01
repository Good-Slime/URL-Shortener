const express = require("express");
const path = require('path')

const { connectToMongoDb } = require('./connect.js')
const { connection } = require("mongoose");

const urlRoute = require('./routes/url.js');
const staticRoute=require('./routes/staticRouter.js')

const url = require("./models/url.js");

const { handleGetAnalytics } = require("./controllers/url.js");

const app = express();
const port = 2000;

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({extended:false}))

connectToMongoDb('mongodb://127.0.0.1:27017/urlShortener')
    .then(() => {
        console.log('connected to Mongoose');
    })
    .catch((err) => {
        console.log(err);
    })

app.get('/test' , async (req,res) => {
    const allUrls = await url.find({});
    return res.render('home')
})

app.use('/url', urlRoute);
app.use('/',staticRoute);

app.get('/url/:shortId', async (req, res) => {
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

