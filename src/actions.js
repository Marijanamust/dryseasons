import axios from "./axios";
var moment = require("moment");

export function addUser(user) {
    return {
        type: "ADD_USER",
        user: user
    };
}

export function loggedIn() {
    return axios.get("/loggedin").then(response => {
        console.log("LOGGED IN", response.data);
        return {
            type: "LOGGED_IN",
            user: response.data
        };
    });
}

export function getEventDetails(eventId) {
    return axios
        .get("/geteventdetails/" + eventId)
        .then(response => {
            console.log();
            return {
                type: "EVENT_DETAILS",
                eventDetails: {
                    ...response.data,
                    eventdate: response.data.eventdate,
                    eventtime: moment(
                        response.data.eventtime,
                        "HH:mm:ss"
                    ).format("hh:mm A")
                }
            };
        })
        .catch(error => {
            console.log(error);
        });
}

export function attend(eventId) {
    return axios
        .post("/attend/" + eventId)
        .then(response => {
            console.log("attend", response.data);

            return {
                type: "ATTEND",
                atendees: response.data
            };
        })
        .catch(error => {
            console.log(error);
        });
}

export function unattend(eventId) {
    return axios
        .post("/unattend/" + eventId)
        .then(response => {
            console.log("attend", response.data);

            return {
                type: "ATTEND",
                atendees: response.data
            };
        })
        .catch(error => {
            console.log(error);
        });
}

export function getMyEvents() {
    return axios
        .get("/getmyevents")
        .then(response => {
            console.log(response.data);
            let mydate = moment(response.data.eventdate).format(
                "dddd, MMMM Do YYYY"
            );

            return {
                type: "MY_EVENTS",
                myEvents: response.data.map(eachevent => {
                    return {
                        ...eachevent,
                        eventdate: mydate,
                        eventtime: moment(
                            eachevent.eventtime,
                            "HH:mm:ss"
                        ).format("hh:mm A")
                    };
                })
            };
        })
        .catch(error => {
            console.log(error);
        });
}

export function changeAvatarAction(formData) {
    console.log("IM in actions");
    return axios
        .post("/upload", formData)
        .then(response => {
            console.log(response);
            return {
                type: "CHANGE_AVATAR",
                imageurl: response.data.imageurl
            };
        })
        .catch(error => {
            console.log(error);
        });
}
