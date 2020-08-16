const fs = require("fs");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
logger.debug("start");

const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxage: 1000 * 60 * 30,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// strategy
const users = JSON.parse(fs.readFileSync("users/users.json", "utf8"));
passport.use(
    new LocalStrategy((username, password, done) => {
        for (const user of users) {
            if (user.username === username && user.password === password) {
                return done(null, user);
            }
        }
        return done(null, false, {
            message: "ユーザー名またはパスワードが正しくありません。",
        });
    })
);

// passport
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// routings
app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.render("login", { error: req.flash("error") });
    }
});
app.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true,
        badRequestMessage: "ユーザー名とパスワードを入力して下さい",
    })
);

const port = 3011;
app.listen(port, () => {});
