const fs = require("fs");

function main() {
    const json = fs.readFileSync("exported/channels.json", "utf8");
    const channels = JSON.parse(json);
    for (const channel of channels) {
        readChannel(channel.name);
    }
}

function readChannel(channel) {
    const files = fs.readdirSync(`./exported/${channel}`);
    let data = [];
    for (const file of files) {
        data = data.concat(readFile(channel, file));
    }
    fs.writeFileSync(`intermediate/${channel}.json`, JSON.stringify(data));
}

function readFile(channel, file) {
    const json = fs.readFileSync(`exported/${channel}/${file}`, "utf8");
    const messages = JSON.parse(json);
    const data = [];
    for (const message of messages) {
        const d = convertMessage(message, channel);
        if (d) {
            data.push(d);
        }
    }
    return data;
}

function convertMessage(message, channel) {
    const { type, subtype, text, user, ts, thread_ts } = message;
    if (type !== "message" || !text || !user) {
        return null;
    }
    if (subtype && subtype.includes("channel")) {
        return null;
    }
    const data = { _key: ts, text, user, channel };
    data.thread_ts = thread_ts ? thread_ts : ts;
    return data;
}

main();
