const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        res.render("login", { error: req.flash("error") });
    }
});
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        badRequestMessage: "ユーザー名とパスワードを入力して下さい",
    })
);

module.exports = router;
