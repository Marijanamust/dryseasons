import React, { useEffect } from "react";
import axios from "./axios";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails, attend, unattend } from "./actions";
// import DatePicker from "react-datepicker";

export function Events({ eventId }) {
    const user = useSelector(state => {
        return state.user;
    });
    const eventDetails = useSelector(state => {
        return state.eventDetails;
    });
    const dispatch = useDispatch();

    console.log("EVENTID", eventId);
    useEffect(() => {
        dispatch(getEventDetails(eventId));

        // return ()=>{
        //     props.resetList
        // }
    }, []);
    const attending = useSelector(state => {
        console.log("event details", state.eventDetails);
        if (
            state.user &&
            state.eventDetails &&
            state.eventDetails.atendees.length &&
            state.eventDetails.atendees.filter(atendee => {
                return atendee.id == user.user_id;
            })
        ) {
            return true;
        } else {
            return false;
        }
    });

    return (
        <div>
            {eventDetails && (
                <div className="eventContainer">
                    <div className="eventIntro">
                        <p>{eventDetails.eventdate}</p>
                        <h1>{eventDetails.name}</h1>
                        <div className="host">
                            <img src={"/sober.jpg" || eventDetails.userimage} />
                            <p>
                                Hosted by {eventDetails.first}{" "}
                                {eventDetails.last}{" "}
                            </p>
                        </div>

                        {user && eventDetails.host_id == user.user_id && (
                            <Link
                                to={{
                                    pathname: `/update/${eventId}`
                                }}
                            >
                                Edit event
                            </Link>
                        )}
                        {eventId && (
                            <Redirect
                                to={{
                                    pathname: `/events/${eventId}`
                                }}
                            />
                        )}

                        {user && !attending && (
                            <button onClick={() => dispatch(attend(eventId))}>
                                Attend
                            </button>
                        )}
                        {user &&
                            attending &&
                            eventDetails.host_id != user.user_id && (
                            <button
                                onClick={() => dispatch(unattend(eventId))}
                            >
                                    Unattend
                            </button>
                        )}
                    </div>
                    <div className="eventDesc">
                        <img src={"/sheep.jfif" || eventDetails.eventimage} />
                        <h2>Description</h2>
                        <p>{eventDetails.description}</p>
                    </div>

                    <div className="eventAttendees">
                        <h2>Atendees</h2>
                        <ul>
                            {eventDetails.atendees &&
                                eventDetails.atendees.map((user, index) => {
                                    return (
                                        <li key={index}>
                                            <Link
                                                to={{
                                                    pathname: `/users/${
                                                        user.id
                                                    }`
                                                }}
                                                className="atendeesBox"
                                            >
                                                <img
                                                    src={
                                                        user.imageurl ||
                                                        "/sheep.jfif"
                                                    }
                                                />
                                                <p>
                                                    {user.first} {user.last}
                                                </p>
                                            </Link>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
