const nroonga = require("nroonga");
const db = new nroonga.Database("database/slack.db");
console.log(
    db.commandSync("select --table Messages --query 'channel:data + ym:201805'")
);
db.close();
