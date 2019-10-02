import React, { useState } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { addUser } from "./actions";

export function Register() {
    const [input, setInput] = useState({});
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const user = useSelector(state => {
        return state.user;
    });
    const register = (e, input) => {
        e.preventDefault();

        return axios
            .post("/register", input)
            .then(response => {
                if (response.data) {
                    dispatch(addUser(response.data));
                } else {
                    setError(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="register">
            <h3>JOIN SOBERNESS</h3>
            {error && <p>Oooops Error</p>}
            <form>
                <input
                    name="first"
                    type="text"
                    placeholder="last"
                    onChange={handleChange}
                    required
                />
                <input
                    name="last"
                    type="text"
                    placeholder="last"
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="email"
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    required
                />
                <button onClick={e => register(e, input)}>Submit</button>
            </form>
            <div>
                <Link to="/login">Already a member?</Link>
            </div>
            {user && <Redirect to="/search" />}
        </div>
    );
}
