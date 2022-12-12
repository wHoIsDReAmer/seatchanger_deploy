const express = require('express');
const router = express.Router();

const { cookies } = require("./data");

router.get("*", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");
        }
    }

    return res.sendFile(__dirname + "/front/index.html");
})

module.exports = router;