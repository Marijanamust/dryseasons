import React from "react";
import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
var moment = require("moment");

import { useDispatch, useSelector } from "react-redux";

export function Search() {
    const [weekEvents, setWeekEvents] = useState([]);
    const [allWeekEvents, setAllWeekEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [allMyEvents, setAllMyEvents] = useState([]);

    const [showNext, setShowNext] = useState(true);
    const [showPrev, setShowPrev] = useState(false);
    const [showNextWeek, setShowNextWeek] = useState(true);
    const [showPrevWeek, setShowPrevWeek] = useState(false);

    const [categories, setCategories] = useState([
        "Outdoors & Adventure",
        "Tech",
        "Family",
        "Health & Wellness",
        "Sports & Fitness",
        "Food & Drink",
        "Language & Culture",
        "Music",
        "LGBTQ",
        "Film",
        "Games",
        "Arts",
        "Dance",
        "Pets",
        "Hobbies",
        "Social",
        "Weird"
    ]);
    const user = useSelector(state => {
        return state.user;
    });
    useEffect(() => {
        axios
            .get("/getmyevents")
            .then(response => {
                console.log(response.data);

                let myevents = adjustTime(response.data);
                setAllMyEvents(myevents);
                if (myevents.length < 5) {
                    setShowNext(false);
                }
                let chosenMyEvents = myevents.slice(0, 4);
                setMyEvents(chosenMyEvents);
            })
            .catch(error => {
                console.log(error);
            });

        axios
            .get("/getthisweek")
            .then(response => {
                console.log(response.data);

                let weekevents = adjustTime(response.data);
                setAllWeekEvents(weekevents);
                if (weekevents.length < 5) {
                    setShowNextWeek(false);
                }
                let chosenWeek = weekevents.slice(0, 4);
                setWeekEvents(chosenWeek);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const adjustTime = function(arr) {
        return arr.map(eachevent => {
            return {
                ...eachevent,
                eventdate: moment(eachevent.eventdate).format(
                    "dddd, MMMM Do YYYY"
                )
            };
        });
    };
    const nextEvent = function() {
        setShowPrev(true);
        let what = allMyEvents.findIndex(events => {
            return events.id == myEvents[0].id;
        });
        if (what >= allMyEvents.length - 5) {
            setShowNext(false);
        }
        setMyEvents(allMyEvents.slice(what + 1, what + 5));
    };
    const prevEvent = function() {
        let what = allMyEvents.findIndex(events => {
            return events.id == myEvents[0].id;
        });
        console.log(what);
        if (what <= 1) {
            setShowPrev(false);
        }
        setMyEvents(allMyEvents.slice(what - 1, what + 3));
    };
    const nextWeekEvent = function() {
        setShowPrevWeek(true);
        let what = allWeekEvents.findIndex(events => {
            return events.id == weekEvents[0].id;
        });
        console.log("WHAT IN WEEK", what, allWeekEvents.length);
        if (what >= allWeekEvents.length - 5) {
            setShowNextWeek(false);
        }
        setWeekEvents(allWeekEvents.slice(what + 1, what + 5));
    };
    const prevWeekEvent = function() {
        let what = allWeekEvents.findIndex(events => {
            return events.id == weekEvents[0].id;
        });
        console.log(what);
        if (what <= 1) {
            setShowPrevWeek(false);
        }
        setWeekEvents(allWeekEvents.slice(what - 1, what + 3));
    };

    return (
        <div className="allEventsContainer">
            {user && (
                <div className="yourEvents">
                    <h2>Your events</h2>

                    <div className="yourContainer">
                        <ul>
                            {showPrev && <p onClick={prevEvent}>Previous</p>}
                            {myEvents != "" ? (
                                myEvents.map(myevent => (
                                    <li key={myevent.id}>
                                        <Link
                                            to={{
                                                pathname: `/events/${
                                                    myevent.id
                                                }`
                                            }}
                                            className="eventBox"
                                        >
                                            <img
                                                src={
                                                    myevent.eventimage ||
                                                    "/sheep.jfif"
                                                }
                                            />
                                            <p>{myevent.eventdate}</p>
                                            <p>{myevent.name}</p>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    You have no events. Why don´t you attend
                                    some?
                                </li>
                            )}
                            {showNext && <p onClick={nextEvent}>Next</p>}
                        </ul>
                        <Link
                            to={{
                                pathname: `/myprofile`
                            }}
                            className="eventBox"
                        >
                            Show All
                        </Link>
                    </div>
                </div>
            )}

            <div className="eventsThisWeek">
                <h2>Events this week</h2>
                <div className="weekContainer">
                    <ul>
                        {showPrevWeek && (
                            <p onClick={prevWeekEvent}>Previous</p>
                        )}
                        {weekEvents != "" ? (
                            weekEvents.map(myevent => (
                                <li key={myevent.id}>
                                    <Link
                                        to={{
                                            pathname: `/events/${myevent.id}`
                                        }}
                                        className="eventBox"
                                    >
                                        <img
                                            src={
                                                myevent.eventimage ||
                                                "/sheep.jfif"
                                            }
                                        />
                                        <p>{myevent.eventdate}</p>
                                        <p>{myevent.name}</p>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li>
                                You have no events. Why don´t you attend some?
                            </li>
                        )}
                        {showNextWeek && <p onClick={nextWeekEvent}>Next</p>}
                    </ul>
                    <Link
                        to={{
                            pathname: `/searchbytime`
                        }}
                        className="eventBox"
                    >
                        Show More
                    </Link>
                </div>
            </div>
            <div className="browse by category">
                <h2>Browse by category</h2>
                {categories.map(category => (
                    <div key={category}>
                        <Link to={{ pathname: `/category/${category}` }}>
                            {category}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
