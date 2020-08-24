const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const express = require("express");
const session = require("express-session");
const passport = require("passport");

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
require("./passport")(app);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};
app.use("/", require("./routes/root"));
app.use(ensureAuthenticated);
app.use("/channels", require("./routes/channels"));
app.use("/search", require("./routes/search"));

const port = 3011;
app.listen(port, () => {});
