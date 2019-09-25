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
    useEffect(
        () => {
            dispatch(getEventDetails(eventId));

            // return ()=>{
            //     props.resetList
            // }
        },
        [eventId]
    );
    const attending = useSelector(state => {
        console.log("event details", state.eventDetails);
        {
            state.eventDetails &&
                console.log("DATE", state.eventDetails.eventdate);
        }
        if (
            state.user &&
            state.eventDetails &&
            state.eventDetails.atendees.length &&
            state.eventDetails.atendees.find(atendee => {
                console.log("atendee.id", atendee.id);
                console.log("user.user_id", user.id);
                console.log("host", eventDetails.host_id);
                return atendee.id == user.id;
            })
        ) {
            return true;
        } else {
            return false;
        }
    });

    return (
        <div className="bigEventContainer">
            {eventDetails && (
                <div className="eventContainer">
                    <div className="eventIntro">
                        <div className="smallIntro">
                            <div className="host">
                                <p>{eventDetails.eventdate}</p>
                                <p>{eventDetails.eventtime}</p>
                                <h1>{eventDetails.name}</h1>
                                <img
                                    src={eventDetails.userimage || "/sober.jpg"}
                                />
                                <p>
                                    Hosted by {eventDetails.first}{" "}
                                    {eventDetails.last}{" "}
                                </p>
                                <p>In category {eventDetails.category}</p>
                            </div>
                            <img
                                src={eventDetails.eventimage || "/sheep.jfif"}
                                className="eventImg"
                            />
                        </div>
                        <div className="buttonsEvent">
                            {user && eventDetails.host_id == user.id && (
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
                                <button
                                    onClick={() => dispatch(attend(eventId))}
                                >
                                    Attend
                                </button>
                            )}
                            {user &&
                                attending &&
                                eventDetails.host_id != user.id && (
                                <button
                                    onClick={() =>
                                        dispatch(unattend(eventId))
                                    }
                                >
                                        Unattend
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="eventDesc">
                        <h2>Location</h2>
                        <p className="address">
                            <a
                                href={`https://maps.google.com/?ll=${
                                    eventDetails.location_lat
                                },${eventDetails.location_lng}`}
                                target="_blank"
                            >
                                <i className="fas fa-map-marker-alt" />
                                {eventDetails.address}
                            </a>
                        </p>

                        <h2>Description</h2>

                        <p>{eventDetails.description}</p>
                    </div>

                    <div className="eventAttendees">
                        <h2>Atendees</h2>
                        <ul className="people">
                            {eventDetails.atendees &&
                                eventDetails.atendees.map((user, index) => {
                                    return (
                                        <li key={index}>
                                            <img
                                                src={
                                                    user.userimage ||
                                                    "/lemon.jpg"
                                                }
                                            />
                                            <p>
                                                {user.first} {user.last}
                                            </p>
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
