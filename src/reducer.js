var moment = require("moment");

export default function reducer(state = {}, action) {
    if (action.type === "ADD_USER") {
        state = {
            ...state,
            user: action.user
        };
    }

    if (action.type === "LOGGED_IN") {
        state = {
            ...state,
            user: action.user
        };
    }

    if (action.type === "EVENT_DETAILS") {
        let newDate = new Date(action.eventDetails.eventdate);
        let iso = newDate.toISOString();
        let mydate = moment(iso).format("dddd, MMMM Do YYYY");

        state = {
            ...state,
            eventDetails: { ...action.eventDetails, eventdate: mydate }
        };
    }
    if (action.type === "ATTEND") {
        state = {
            ...state,
            eventDetails: { ...state.eventDetails, atendees: action.atendees }
        };
    }

    if (action.type === "MY_EVENTS") {
        state = {
            ...state,
            myEvents: action.myEvents
        };
    }

    if (action.type === "CHANGE_AVATAR") {
        state = {
            ...state,
            user: { ...state.user, imageurl: action.imageurl }
        };
    }
    return state;
}
