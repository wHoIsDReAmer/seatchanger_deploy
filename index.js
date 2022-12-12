const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mainRouter = require("./router/mainRouter");
const apiRouter = require("./router/apiRouter");

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/router/front"));

app.use("/", mainRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT || 5001, () => {
    console.log(process.env.PORT || 5001 + " 포트에서 리슨 중..");
});