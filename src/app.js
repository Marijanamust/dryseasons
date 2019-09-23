import React, { useEffect } from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { socket } from "./socket";
import { Search } from "./search";
import { Profile } from "./profile";
import { Users } from "./users";
import { Events } from "./events";
import { Create } from "./create";
import { Register } from "./register";
import { Login } from "./login";
import { Update } from "./update";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "./actions";

export function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loggedIn());
        // return ()=>{
        //     props.resetList
        // }
    }, []);
    const user = useSelector(state => {
        return state.user;
    });

    return (
        <BrowserRouter>
            <React.Fragment>
                <div>
                    <header>
                        <h2>SOBER BERLIN</h2>
                        <div className="rightHead">
                            {user && <Link to="/create">Create an event</Link>}
                            {!user && <Link to="/login">Login</Link>}
                            {!user && <Link to="/register">Register</Link>}

                            {user && <a href="/logout">Logout</a>}
                        </div>
                    </header>
                    <div className="mainDiv">
                        <Route exact path="/search" component={Search} />
                        <Route
                            path="/users/:id"
                            render={props => {
                                return <Users match={props.match.params.id} />;
                            }}
                        />
                        <Route
                            path="/events/:eventId"
                            render={props => {
                                return (
                                    <Events
                                        eventId={props.match.params.eventId}
                                    />
                                );
                            }}
                        />
                        <Route exact path="/map" component={Map} />
                        <Route exact path="/myprofile" component={Profile} />
                        <Route path="/create" component={Create} />
                        <Route
                            path="/update/:eventId"
                            render={props => {
                                return (
                                    <Update
                                        eventId={props.match.params.eventId}
                                    />
                                );
                            }}
                        />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                    </div>
                </div>
            </React.Fragment>
        </BrowserRouter>
    );
}
