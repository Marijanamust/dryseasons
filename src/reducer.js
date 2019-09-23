var moment = require("moment");

export default function reducer(state = {}, action) {
    if (action.type === "ADD_USER") {
        console.log("USER IN REDUCER", action.user);
        state = {
            ...state,
            user: action.user
        };
    }

    if (action.type === "LOGGED_IN") {
        console.log("USER IN REDUCER", action.user);
        state = {
            ...state,
            user: action.user
        };
    }

    if (action.type === "EVENT_DETAILS") {
        console.log("details IN REDUCER", action.eventDetails);
        // console.log("WHAT", response.data);
        // let mydate = moment(newDate).format("dddd, MMMM Do YYYY");

        console.log("DATE IN ACTION", action.eventDetails.eventdate);

        // let mydate = moment(response.data.eventdate).format(
        //     "dddd, MMMM Do YYYY"
        // );

        let newDate = new Date(action.eventDetails.eventdate);
        let iso = newDate.toISOString();
        let mydate = moment(iso).format("dddd, MMMM Do YYYY");
        console.log("new Date", newDate);
        console.log("iso", iso);
        state = {
            ...state,
            eventDetails: { ...action.eventDetails, eventdate: mydate }
        };
    }
    if (action.type === "ATTEND") {
        console.log("details IN REDUCER", action.atendees);
        state = {
            ...state,
            eventDetails: { ...state.eventDetails, atendees: action.atendees }
        };
    }
    return state;
}
