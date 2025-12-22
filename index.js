const express = require("express");
const path = require('path')

const { connectToMongoDb } = require('./connect.js')
const { connection } = require("mongoose");

const rateLimit = require("express-rate-limit");

require("dotenv").config()

const urlRoute = require('./routes/url.js');
const staticRoute=require('./routes/staticRouter.js')

const url = require("./models/url.js");

const { handleGetAnalytics } = require("./controllers/url.js");

const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.locals.BaseUrl = process.env.BaseUrl;
  next();
});

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'))


app.use(express.json());
app.use(express.urlencoded({extended:false}))

connectToMongoDb(process.env.MongoUrl)
    .then(() => {
        console.log('connected to Mongoose');
    })
    .catch((err) => {
        console.log(err);
    })

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
})

app.use(limiter);

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

