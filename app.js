const express = require("express");
const app = express();
const cors = require("cors");
const passportConfig = require("./config/passport_config.js");
const passport = require("passport");
const keys = require("./config/keys.js");
const cookieSession = require('cookie-session');
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [keys.cookieSecret]
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/user", require("./routes/userRoute.js"));

const PORT = process.env.PORT || 8460;

app.listen(PORT);
