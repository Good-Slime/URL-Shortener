const express = require("express");

const {handleUserLogin, handleUserSighUp} = require("../controllers/user")

const router = express.Router()

router.post('/' , handleUserSighUp)
router.post('/login' , handleUserLogin )

module.exports = router;