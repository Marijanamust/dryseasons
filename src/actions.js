import axios from "./axios";

export function addUser(user) {
    return {
        type: "ADD_USER",
        user: user
    };
}

export function loggedIn() {
    return axios.get("/loggedin").then(response => {
        return {
            type: "LOGGED_IN",
            user: response.data
        };
    });
}
