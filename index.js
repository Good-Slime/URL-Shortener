const express = require("express");
const path = require('path')
const cookieParser= require('cookie-parser')
const { connectToMongoDb } = require('./connect.js')
const { checkAuth , restrictToLoggedinUserOnly } = require("./middlewares/auth.js");

const url = require("./models/url.js");

const rateLimit = require("express-rate-limit");

require("dotenv").config()
const { handleGetAnalytics } = require("./controllers/url.js");


const urlRoute = require('./routes/url.js');
const staticRoute=require('./routes/staticRouter.js')
const userRoute = require('./routes/user.js')



const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.locals.BaseUrl = process.env.BaseUrl;
  next();
});
connectToMongoDb(process.env.MongoUrl)
    .then(() => {
        console.log('connected to Mongoose');
    })
    .catch((err) => {
        console.log(err);
    })

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
})


app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());



app.use(limiter);
app.use('/url',restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);
app.use('/', checkAuth ,staticRoute);

app.get('/test' , async (req,res) => {
    const allUrls = await url.find({});
    return res.render('home')
})

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


app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
})

