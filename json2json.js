const fs = require("fs");
const moment = require("moment");

class Converter {
    convert() {
        const channels = this.getChannels();
        this.loadUserDict();
        for (const channel of channels) {
            this.readChannel(channel.name);
        }
    }
    getChannels() {
        const json = fs.readFileSync("exported/channels.json", "utf8");
        return JSON.parse(json);
    }
    loadUserDict() {
        const json = fs.readFileSync("exported/users.json", "utf8");
        const users = JSON.parse(json);
        this.userDict = {};
        for (const { id, real_name } of users) {
            this.userDict[id] = real_name;
        }
    }
    readChannel(channel) {
        const files = fs.readdirSync(`./exported/${channel}`);
        this.data = [];
        for (const file of files) {
            this.readFile(channel, file);
        }
        const json = JSON.stringify(this.data);
        fs.writeFileSync(`intermediate/${channel}.json`, json);
    }
    readFile(channel, file) {
        const json = fs.readFileSync(`exported/${channel}/${file}`, "utf8");
        const messages = JSON.parse(json);
        for (const message of messages) {
            const d = this.convertMessage(message, channel);
            if (d) {
                this.data.push(d);
            }
        }
    }
    convertMessage(message, channel) {
        const { type, subtype, text, user, ts, thread_ts } = message;
        if (type !== "message" || !text || !user) {
            return null;
        }
        if (subtype && subtype.includes("channel")) {
            return null;
        }
        const ym = moment.unix(ts).add(9, "hours").format("YYYYMM");
        const data = { _key: ts, ym, text, user: this.userDict[user], channel };
        data.thread_ts = thread_ts ? thread_ts : ts;
        return data;
    }
}

new Converter().convert();
