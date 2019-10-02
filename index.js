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
    getCategory,
    getAllEvents,
    getPopular
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

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/search");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.post("/upload", uploader.single("file"), s3.upload, async (req, res) => {
    const url =
        config.s3Url + `${req.session.user.user_id}/${req.file.filename}`;

    try {
        const data = await updateAvatar(url, req.session.user.user_id);

        res.json(data[0]);
    } catch (error) {
        console.log(error);
        res.json(false);
    }
});

app.post("/register", function(req, res) {
    if (!req.body.password) {
        res.json(false);
    } else {
        hash(req.body.password).then(hash => {
            addRegister(req.body.first, req.body.last, req.body.email, hash)
                .then(data => {
                    req.session.user = {
                        first: data[0].first,
                        last: data[0].last,
                        user_id: data[0].id,
                        imageurl: data[0].imageurl
                    };

                    res.json(data[0]);
                })
                .catch(error => {
                    console.log(error);
                    res.json(false);
                });
        });
    }
});

app.post("/login", function(req, res) {
    getHash(req.body.email)
        .then(data => {
            compare(req.body.password, data.password)
                .then(match => {
                    if (match) {
                        req.session.user = {
                            first: data.first,
                            last: data.last,
                            user_id: data.id,
                            imageurl: data.imageurl
                        };

                        res.json(data);
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
    if (req.session.user) {
        getUser(req.session.user.user_id)
            .then(data => {
                res.json(data[0]);
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        res.json(false);
    }
});

app.post("/addevent", uploader.single("file"), s3.upload, (req, res) => {
    // req.file refers to the file that was just uploaded
    // req.body still refers to the values we type in the input fields

    // const { filename } = req.file;
    const url =
        config.s3Url + `${req.session.user.user_id}/${req.file.filename}`;

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
            attend(data[0].id, req.session.user.user_id).then(() => {
                res.json(data[0].id);
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/geteventdetails/:eventId", (req, res) => {
    Promise.all([getEvent(req.params.eventId), getAtendees(req.params.eventId)])
        .then(data => {
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
    attend(req.params.eventId, req.session.user.user_id)
        .then(() => {
            getAtendees(req.params.eventId).then(data => {
                res.json(data);
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.post("/unattend/:eventId", (req, res) => {
    unattend(req.params.eventId, req.session.user.user_id)
        .then(() => {
            getAtendees(req.params.eventId).then(data => {
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
                .then(() => {
                    res.json(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            const url =
                config.s3Url +
                `${req.session.user.user_id}/${req.file.filename}`;

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
                    res.json(true);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
);
app.get("/getmyevents", (req, res) => {
    if (req.session.user) {
        getMyEvents(req.session.user.user_id)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        res.json(false);
    }
});

app.get("/getthisweek", (req, res) => {
    getThisWeek()
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/getpopular", (req, res) => {
    getPopular()
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/find/:categoryName", (req, res) => {
    let category = req.params.categoryName;

    if (req.params.categoryName == "Show all events") {
        getAllEvents()
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        getCategory(category)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.log(error);
            });
    }
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("I'm listening.");
});
