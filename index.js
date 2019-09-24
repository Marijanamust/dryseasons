const express = require("express");
const app = express();
const compression = require("compression");

const cookieSession = require("cookie-session");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const { hash, compare } = require("./utils/bc.js");
var moment = require("moment");
const {
    addRegister,
    getHash,
    getUser,
    updateAvatar,
    insertEvent,
    getEvent,
    attend,
    unattend,
    getAtendees,
    updateEvent,
    updateEventNoFile,
    getMyEvents,
    getThisWeek,
    getCategory
} = require("./utils/db.js");
const localeData = moment.localeData();
// for heroku list you app with star in the end, List myapp.herokuapp.com:*

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret:
        process.env.NODE_ENV == "production"
            ? process.env.SESS_SECRET
            : require("./secrets").sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/search");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        console.log("in register");
        res.redirect("/search");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/search");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", function(req, res) {
    if (!req.body.password) {
        res.json(false);
    } else {
        hash(req.body.password).then(hash => {
            addRegister(req.body.first, req.body.last, req.body.email, hash)
                .then(data => {
                    console.log("DATA", data);
                    req.session.user = {
                        first: data[0].first,
                        last: data[0].last,
                        user_id: data[0].id,
                        imageurl: data[0].imageurl
                    };
                    console.log("USER", req.session.user);
                    res.json(req.session.user);
                })
                .catch(error => {
                    console.log(error);
                    res.json(false);
                });
        });
    }
});

app.post("/login", function(req, res) {
    console.log(req.body.email);
    getHash(req.body.email)
        .then(data => {
            compare(req.body.password, data.password)
                .then(match => {
                    if (match) {
                        console.log("DATA IN LOGIN", data);
                        req.session.user = {
                            first: data.first,
                            last: data.last,
                            user_id: data.id,
                            imageurl: data.imageurl
                        };
                        console.log("USER", req.session.user);
                        res.json(req.session.user);
                        // console.log(req.session.user);
                    } else {
                        res.json(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                    res.json(false);
                });
        })
        .catch(error => {
            console.log(error);
            res.json(false);
        });
});

app.get("/loggedin", (req, res) => {
    console.log("logged in got dispatched");
    if (req.session.user) {
        console.log("req session user", req.session.user);
        res.json(req.session.user);
    } else {
        res.json(false);
        console.log("user is not logged in");
    }
});

app.post("/addevent", uploader.single("file"), s3.upload, (req, res) => {
    // req.file refers to the file that was just uploaded
    // req.body still refers to the values we type in the input fields
    console.log("DATE", req.body.date);
    // const { filename } = req.file;
    const url =
        config.s3Url + `${req.session.user.user_id}/${req.file.filename}`;
    // console.log(url);
    let {
        name,
        date,
        time,
        location_lat,
        location_lng,
        address,
        description,
        category
    } = req.body;
    console.log("url", url);
    console.log("req.body", req.body);
    // Date.prototype.addDays = function(days) {
    //     let dat = new Date(this.valueOf());
    //     dat.setDate(dat.getDate() + days);
    //     return dat;
    // };
    // date = new Date(date).addDays(1);

    insertEvent(
        name,
        date,
        time,
        location_lat,
        location_lng,
        address,
        url,
        description,
        category,
        req.session.user.user_id
    )
        .then(data => {
            console.log("GOT THE TABLE", data[0].id);
            attend(data[0].id, req.session.user.user_id).then(() => {
                res.json(data[0].id);
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/geteventdetails/:eventId", (req, res) => {
    console.log("IN GET VENT");
    Promise.all([getEvent(req.params.eventId), getAtendees(req.params.eventId)])
        .then(data => {
            console.log("event", data[0][0]);
            console.log("atend", data[1]);
            console.log("DATE", data[0][0].eventdate);
            // let mydate = moment(data[0].eventdate).format("dddd, MMMM Do YYYY");
            // moment(data[0].eventdate)
            //     .calendar()
            //     .format("dddd");
            // console.log("my date", mydate);
            if (data[0].length) {
                let details = {
                    ...data[0][0],

                    atendees: data[1]
                };
                res.json(details);
            } else {
                res.json(false);
            }
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/search");
});

app.post("/attend/:eventId", (req, res) => {
    console.log("REQ BODY", req.session.user.user_id);
    console.log("REq params", req.params.eventId);
    attend(req.params.eventId, req.session.user.user_id)
        .then(() => {
            console.log("inserted the atendee");
            getAtendees(req.params.eventId).then(data => {
                console.log(data[0]);
                res.json(data);
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.post("/unattend/:eventId", (req, res) => {
    console.log("user id", req.session.user.user_id);
    console.log("REq params", req.params.eventId);
    unattend(req.params.eventId, req.session.user.user_id)
        .then(() => {
            console.log("unattended");
            getAtendees(req.params.eventId).then(data => {
                console.log(data[0]);
                res.json(data);
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.post(
    "/updateevent/:eventId",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("DATE", req.body.eventdate);
        const {
            name,
            eventdate,
            eventtime,
            location_lat,
            location_lng,
            address,
            description,
            category
        } = req.body;
        if (!req.file) {
            updateEventNoFile(
                name,
                eventdate,
                eventtime,
                location_lat,
                location_lng,
                address,
                description,
                category,
                req.params.eventId
            )
                .then(data => {
                    console.log("UPDATED");
                    res.json(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            const url =
                config.s3Url +
                `${req.session.user.user_id}/${req.file.filename}`;
            // console.log(url);

            // console.log("url", url);
            // console.log("req.body", req.body);

            updateEvent(
                name,
                eventdate,
                eventtime,
                location_lat,
                location_lng,
                address,
                url,
                description,
                category,
                req.params.eventId
            )
                .then(data => {
                    console.log("UPDATED");
                    res.json(true);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
);
app.get("/getmyevents", (req, res) => {
    console.log("IN GET my events");
    getMyEvents(req.session.user.user_id)
        .then(data => {
            console.log("events", data);

            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/getthisweek", (req, res) => {
    console.log("IN GET this week events");
    getThisWeek()
        .then(data => {
            console.log("this week", data);

            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/find/:categoryName", (req, res) => {
    console.log(req.params.categoryName);
    let category = req.params.categoryName;
    console.log(category);
    console.log(typeof category);
    getCategory(category)
        .then(data => {
            console.log(data);

            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
});

//this route always needs to be last, out everything above it..
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("I'm listening.");
});
