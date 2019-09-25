var moment = require("moment");

exports.parseDate = function(created_at) {
    var date = new Date(Date.parse(created_at));
    var user_date = new Date();
    var diff = Math.floor((user_date - date) / 1000);

    if (diff <= 129600) {
        return "1 day ago";
    }
    if (diff > 604800) {
        return "in " + Math.round(diff / 86400) + " days";
    }
    if (diff >= 777600) {
        return "in one week";
    }
    return "on " + date;
};

exports.showEvents = function(time, allMyEvents) {
    let today = moment(new Date());
    let tomorrow = moment(new Date()).add(1, "days");
    let nextWeek = moment(new Date()).add(1, "week");
    let showEvents;
    if (time == "Tomorrow") {
        console.log("Im in tomorrow");
        console.log("Im in function");

        showEvents = allMyEvents.filter(eachevent => {
            if (
                moment(eachevent.eventdate, "dddd, MMMM Do YYYY").isSame(
                    tomorrow,
                    "d"
                )
            ) {
                return eachevent;
            }
        });
    } else if (time == "This week") {
        console.log("im in this week");

        showEvents = allMyEvents.filter(eachevent => {
            // console.log(new Date(eachevent.eventdate));
            if (
                moment(eachevent.eventdate, "dddd, MMMM Do YYYY").isSame(
                    new Date(),
                    "week"
                )
            ) {
                console.log(eachevent.eventdate);
                return eachevent;
            }
        });
    } else if (time == "Next week") {
        console.log("im in next week");

        showEvents = allMyEvents.filter(eachevent => {
            // console.log(new Date(eachevent.eventdate));
            if (
                moment(eachevent.eventdate, "dddd, MMMM Do YYYY").isSame(
                    nextWeek,
                    "week"
                )
            ) {
                console.log(eachevent.eventdate);
                return eachevent;
            }
        });
    } else if (time == "Today") {
        showEvents = allMyEvents.filter(eachevent => {
            if (
                moment(eachevent.eventdate, "dddd, MMMM Do YYYY").isSame(
                    today,
                    "d"
                )
            ) {
                return eachevent;
            }
        });
    } else if (time == "All events") {
        showEvents = allMyEvents;
    }

    return showEvents;
};

exports.adjustTime = function(arr) {
    return arr.map(eachevent => {
        return {
            ...eachevent,
            eventdate: moment(eachevent.eventdate).format("dddd, MMMM Do YYYY"),
            eventtime: moment(eachevent.eventtime, "HH:mm:ss").format("hh:mm A")
        };
    });
};
