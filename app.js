const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
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

// 認証設定
const users = JSON.parse(fs.readFileSync("users/users.json", "utf8"));
const localStrategy = new LocalStrategy((username, password, done) => {
    for (const user of users) {
        if (user.username === username && user.password === password) {
            return done(null, user);
        }
    }
    return done(null, false);
});
passport.use(localStrategy);
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routing
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render("login", { message: "" });
    }
}

app.get("/login", (req, res) => {
    res.render("login", { message: "" });
});

app.post(
    "/login",
    passport.authenticate(
        "local",
        {
            successRedirect: "/",
            failureRedirect: "/login",
        },
        (req, res) => {
            res.render("login", {
                message: "ユーザー名またはパスワードが正しくありません。",
            });
        }
    )
);

app.get("/", isAuthenticated, (req, res) => {
    res.render("top");
});

const port = 3011;
app.listen(port, () => {});
