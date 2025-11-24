const mongoose = require("mongoose");

const urlshema = new mongoose.Schema({
    shortId:{
        type: String,
        required: true,
        unique: true
    },
    redirectUrl:{
        type: String,
        required: true,
    },

    visitHistory:[
        {timestamp:{type:Number}
    }
]
},
    {timestamp:true},
)

const url = mongoose.model("url", urlshema);

module.exports = url;