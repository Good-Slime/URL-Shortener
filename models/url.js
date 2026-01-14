const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true, 
      index: true
    },

    redirectUrl: {
      type: String,
      required: true
    },
    visitHistory: [
      {
        timestamp: {
          type: Number
        }
      }
    ],

    expiresAt: {
      type: Date     
    },
    createdBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
  },
  {
    timestamps: true 
  }
);

urlSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


const url = mongoose.model("url", urlSchema);

module.exports = url;