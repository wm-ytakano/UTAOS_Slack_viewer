const fs = require("fs");
const request = require("request");

async function main() {
    const files = fs.readdirSync(`./intermediate`);
    await removeRecords();
    for (const file of files) {
        const text = fs.readFileSync(`./intermediate/${file}`, "utf8");
        const json = JSON.parse(text);
        await postJSON(json);
    }
    await shutdown();
}

function removeRecords() {
    const options = {
        uri: "http://127.0.0.1:10041/d/truncate?table=Messages",
    };
    return new Promise((resolve) => {
        request.get(options, (error) => {
            if (error) {
                console.error(error);
            }
            resolve();
        });
    });
}

function postJSON(json) {
    const options = {
        uri: "http://127.0.0.1:10041/d/load?table=Messages",
        headers: { "Content-type": "application/json" },
        json,
    };
    return new Promise((resolve) => {
        request.post(options, (error) => {
            if (error) {
                console.error(error);
            }
            resolve();
        });
    });
}

function shutdown() {
    const options = {
        uri: "http://127.0.0.1:10041/d/shutdown",
    };
    return new Promise((resolve) => {
        request.get(options, (error) => {
            if (error) {
                console.error(error);
            }
            resolve();
        });
    });
}

main();
