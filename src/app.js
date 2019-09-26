import React, { useEffect } from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { socket } from "./socket";
import { Search } from "./search";
import { Profile } from "./profile";
import { AllPlaces } from "./allplaces";
import { Events } from "./events";
import { Create } from "./create";
import { Category } from "./category";
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
                        <h2>Dry Seasons Berlin</h2>
                        <div className="rightHead">
                            {user && <Link to="/create">Create an event</Link>}
                            {!user && <Link to="/login">Login</Link>}
                            {!user && <Link to="/register">Register</Link>}
                            <Link to="/search">Search</Link>
                            <Link to="/allplaces">Map</Link>
                            {user && (
                                <Link to="/myprofile">Hi, {user.first}</Link>
                            )}

                            {user && <a href="/logout">Logout</a>}
                        </div>
                    </header>
                    <div className="mainDiv">
                        <Route exact path="/search" component={Search} />

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

                        <Route exact path="/myprofile" component={Profile} />
                        <Route path="/create" component={Create} />
                        <Route path="/allplaces" component={AllPlaces} />
                        <Route
                            path="/category/:categoryName"
                            render={props => {
                                return (
                                    <Category
                                        categoryName={
                                            props.match.params.categoryName
                                        }
                                    />
                                );
                            }}
                        />
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
