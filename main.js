const { app, BrowserWindow } = require('electron');

app.commandLine.appendSwitch('ignore-certificate-errors')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1024,
        height: 720,
        backgroundColor: '#ffffff'
    });

    win.loadURL(`file://${__dirname}/dist/review-dashboard/index.html`);

    // win.webContents.openDevTools();

    win.on("closed", function () {
        win = null;
    });

    //main backend

    const express = require('express')
    const exp = express();
    const port = 3000;
    const cors = require("cors");
    const gplay = require("google-play-scraper");
    const store = require("app-store-scraper");
    const https = require("https");

    exp.use(express.json());
    exp.use(
        cors({
            origin: [
                "http://localhost:3000",
                "https://localhost:3000/",
                "localhost:3000",
                "http://localhost:4200",
                "https://localhost:4200/",
                "localhost:4200",
            ],
        })
    );

    exp.get("/", (req, res, err) => {
        console.log("Backend Server started");
        return res.status(200).json({ message: "Backend Server running !" });
    });

    exp.post("/android/app", (req, res) => {
        let app = req.body.name;

        gplay.app({ appId: app })
            .then(data => {
                res.status(200).json({ result: JSON.stringify(data) });
            })
    });

    exp.post("/android/review", (req, res) => {
        let app = req.body.name;

        gplay.reviews({
            appId: app, sort: gplay.sort.NEWEST,
            num: 3000
        })
            .then(data => {
                res.status(200).json({ result: JSON.stringify(data) });
            })
    });

    exp.post("/ios/app", (req, res) => {
        let app = req.body.name;

        store.app({ id: app })
            .then(data =>
                res.status(200).json({ result: JSON.stringify(data) }))
            .catch(console.log);
    });

    exp.post("/ios/review", (req, res) => {
        let app = req.body.name;
        let page = req.body.page;

        let url = "https://itunes.apple.com/us/rss/customerreviews/page=" + page + "/id=" + app + "/sortby=mostrecent/json";
        let x = https.get(url, function (data) {
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            data.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function () {
                var body = Buffer.concat(bodyChunks);
                // console.log('BODY: ' + body);
                res.status(200).json({ result: body.toString() })
                // ...and/or process the entire body here.
            })
        })

        x.on("error", function (err) {
            console.log("error", err);
        })

        // store.reviews({
        //     id: app,
        //     sort: store.sort.RECENT,
        //     page: 5
        // })
        //     .then(data =>
        //         res.status(200).json({ result: data }))
        //     .catch(console.log);
    });

    exp.post("/ios/rating", (req, res) => {
        let app = req.body.name;

        store.ratings({
            id: app
        })
            .then(data =>
                res.status(200).json({ result: JSON.stringify(data) }))
            .catch(console.log);
    });

    exp.listen(port, () => {
        console.log(`Review app listening on port ${port}`)
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    if (win == null) {
        createWindow();
    }
})