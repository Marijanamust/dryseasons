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
            user: action.user.data
        };
    }

    return state;
}
