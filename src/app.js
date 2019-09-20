import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { socket } from "./socket";
import { Search } from "./search";
import { Profile } from "./profile";
import { Users } from "./users";
import { Events } from "./events";

export function App() {
    return (
        <BrowserRouter>
            <React.Fragment>
                <div>
                    <header>
                        <h2>SOBER BERLIN</h2>
                        <div className="rightHead">
                            <Link to="/create">Create an event</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Login</Link>
                            <Link to="/logout">Logout</Link>
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
                            path="/events/:id"
                            render={props => {
                                return <Events match={props.match.params.id} />;
                            }}
                        />
                        <Route exact path="/map" component={Map} />
                        <Route exact path="/myprofile" component={Profile} />
                    </div>
                </div>
            </React.Fragment>
        </BrowserRouter>
    );
}
