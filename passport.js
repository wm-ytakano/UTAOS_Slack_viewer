const fs = require("fs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = () => {
    // passport
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
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
};
