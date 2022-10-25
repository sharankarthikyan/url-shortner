const express = require("express");
var cors = require("cors");
const logger = require("morgan");
require("./redis-client");

const defaultPath = "./api/v1";

/* ------ Importing router from API folder ------ */
// App Business logic core APIs
const urlGet = require(`${defaultPath}/urlget`);

const urlRouter = require(`${defaultPath}/url`);

/* ------ Express App ------ */
const app = express();

/* ------ Including middleware to our Express app ------ */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ------ CORS ALLOWING ------ */
app.use(
    cors({
        origin: "https://free-shortify-url.herokuapp.com/",
    })
);

// const cors = require('cors');
// app.use(cors({
//     origin: ['https://www.section.io', 'https://www.google.com/']
// }));

/* ------ Buisness Logic ------ */
// App Business logic core APIs
app.use("/", urlGet);

app.use("/api/v1/url", urlRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT);
