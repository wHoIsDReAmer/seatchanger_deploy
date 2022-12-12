const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { user_data, cookies, user_seats } = require("./data");

const cookieConfig = {
    httpOnly: true,
    maxAge: 9000000,
};

router.post("/login_proc", (req, res) => {
    if (isNaN(req.body.id)) {
        res.json({result: false, msg: "it's not number"});
        return;
    }

    if (user_data[req.body.id] == null) {
        res.json({result: false, msg: "can't find id."});
        return;
    }

    let session = crypto.createHash("sha512").update(req.body.id +  Number(new Date()).toString()).digest("hex");
    res.cookie("se_session", session, cookieConfig);
    cookies[session] = {name: user_data[req.body.id].name, id: req.body.id, expired: Number(new Date()) + 900000, is_admin: user_data[req.body.id].is_admin};
    res.json({result: true, msg: user_data[req.body.id].name});
});

router.post("/raffle", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");

            return res.json({result: false, msg: ""});
        }
    } else {
        return res.json({result: false, msg: ""});
    }

    let keys = Object.keys(user_seats);
    for (let i = 0; i < keys.length; i++)
        if (user_seats[keys[i]].id == cookies[req.cookies["se_session"]].id) {
            res.json({result: false, msg: "이미 자리가 있습니다."});
            return;
        }

    let arr = Object.keys(user_seats).filter(s => user_seats[s].id == null);
    let seat = arr[Math.floor(Math.random() * arr.length)];
    user_data[cookies[req.cookies["se_session"]].id].seat = seat;
    user_seats[seat] = {id: cookies[req.cookies["se_session"]].id, name: cookies[req.cookies["se_session"]].name};
    res.json({result: true, msg: seat});
});

router.post("/my_seat", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");

            return res.json({result: false, msg: ""});
        }
    } else {
        return res.json({result: false, msg: ""});
    }

    if (user_data[cookies[req.cookies["se_session"]].id].seat)
        res.json({result: true, msg: user_data[cookies[req.cookies["se_session"]].id].seat});
    else res.json({result: false, msg: ""});
});

router.post("/is_login", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");
            return res.json({result: false, msg: "session expired"});
        }
    } else {
        return res.json({result: false, msg: ""});
    }
    res.json({result: true, msg: cookies[req.cookies["se_session"]].name, is_admin: cookies[req.cookies["se_session"]].is_admin});
});

router.post("/seat_list", (req, res) => {
    res.json(user_seats);
});

router.post("/reset", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");
            console.log("session expired")
            return res.json({result: false, msg: ""});
        }
    } else {
        return res.json({result: false, msg: ""});
    }

    if (cookies[req.cookies["se_session"]].is_admin) {
        for (let i of Object.keys(user_seats))
            user_seats[i] = {};
        for (let i of Object.keys(user_data))
            delete user_data[i].seat;

        res.json({result: true, msg: "succeed task"});
    } else {
        res.json({result: false, msg: "bad request"});
    }
});

router.post("/random", (req, res) => {
    if (req.cookies["se_session"] && cookies[req.cookies["se_session"]]) { // if it is exists
        if (cookies[req.cookies["se_session"]].expired < Number(new Date())) {
            delete cookies[req.cookies["se_session"]];
            res.clearCookie("se_session");
            return res.json({result: false, msg: ""});
        }
    } else {
        return res.json({result: false, msg: ""});
    }

    if (cookies[req.cookies["se_session"]].is_admin) {

        for (let i of Object.keys(user_data)) {
            if (user_data[i].seat || user_data[i].is_admin)
                continue;

            let arr = Object.keys(user_seats).filter(s => user_seats[s].id == null);
            let seat = arr[Math.floor(Math.random() * arr.length)];

            user_data[i].seat = seat;
            user_seats[seat] = {id: i, name: user_data[i].name};
        }


        res.json({result: true, msg: "succeed task"});
    } else {
        res.json({result: false, msg: "bad request"});
    }
});

module.exports = router;