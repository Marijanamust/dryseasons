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
        state = {
            ...state,
            eventDetails: action.eventDetails
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
