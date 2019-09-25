import React from "react";
import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
var moment = require("moment");
import { showEvents, adjustTime } from "../utils/helpers";

import { useDispatch, useSelector } from "react-redux";

export function Search() {
    const [weekEvents, setWeekEvents] = useState([]);
    const [allWeekEvents, setAllWeekEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [allMyEvents, setAllMyEvents] = useState([]);
    const [popularEvents, setPopularEvents] = useState([]);
    const [somePopularEvents, setSomePopularEvents] = useState([]);
    const [showNext, setShowNext] = useState(true);
    const [showPrev, setShowPrev] = useState(false);
    const [showNextWeek, setShowNextWeek] = useState(true);
    const [showPrevWeek, setShowPrevWeek] = useState(false);
    const [showNextPop, setShowNextPop] = useState(true);
    const [showPrevPop, setShowPrevPop] = useState(false);

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
        "Weird",
        "Show all events"
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
        axios
            .get("/getpopular")
            .then(response => {
                let popular = adjustTime(response.data);
                setPopularEvents(popular);
                let chosenPop = popular.slice(0, 4);
                setSomePopularEvents(chosenPop);
                console.log(popularEvents);
                console.log(somePopularEvents);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

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
        setShowNext(true);
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
        setShowNextWeek(true);
        let what = allWeekEvents.findIndex(events => {
            return events.id == weekEvents[0].id;
        });
        console.log(what);
        if (what <= 1) {
            setShowPrevWeek(false);
        }
        setWeekEvents(allWeekEvents.slice(what - 1, what + 3));
    };

    const nextPopEvent = function() {
        setShowPrevPop(true);
        let what = popularEvents.findIndex(events => {
            return events.id == somePopularEvents[0].id;
        });
        // console.log("WHAT IN WEEK", what, allWeekEvents.length);
        if (what >= popularEvents.length - 5) {
            setShowNextPop(false);
        }
        setSomePopularEvents(popularEvents.slice(what + 1, what + 5));
    };
    const prevPopEvent = function() {
        setShowNextPop(true);
        let what = popularEvents.findIndex(events => {
            return events.id == somePopularEvents[0].id;
        });
        console.log(what);
        if (what <= 1) {
            setShowPrevPop(false);
        }
        setSomePopularEvents(popularEvents.slice(what - 1, what + 3));
    };

    return (
        <div className="allEventsContainer">
            <div className="searchIntro">
                <div className="leftIntro">
                    <h1>We all need a break sometimes.</h1>
                    <p>
                        From Dryanuary through to Sober October, this is the
                        place to explore the world of sober possibilities.
                        Attend events to meet other sober people, try something
                        new, or find inspiration what to do today (and maybe go
                        get wasted tomorrow). We don't judge, we provide.
                        Whatever makes you tick. We have it.
                    </p>
                </div>
                <div className="rightIntro">
                    <img src="/breathe.jfif" />
                </div>
            </div>
            {user && myEvents != "" && (
                <div className="yourEvents">
                    <div className="yourIntro">
                        <h2>Your events</h2>
                        <Link
                            to={{
                                pathname: `/myprofile`
                            }}
                            className="eventBox"
                        >
                            Show All
                        </Link>
                    </div>
                    <div className="yourContainer">
                        {showPrev && (
                            <div onClick={prevEvent} className="icon">
                                <i className="fas fa-arrow-circle-left" />
                            </div>
                        )}
                        <ul>
                            {myEvents != "" ? (
                                myEvents.map(myevent => (
                                    <li key={myevent.id} className="card">
                                        <Link
                                            to={{
                                                pathname: `/events/${
                                                    myevent.id
                                                }`
                                            }}
                                            className="eventLink"
                                        >
                                            <img
                                                src={
                                                    myevent.eventimage ||
                                                    "/sheep.jfif"
                                                }
                                            />
                                            <div className="textCard">
                                                <p className="time">
                                                    {myevent.eventdate}{" "}
                                                    {myevent.eventtime}
                                                </p>
                                                <h2>{myevent.name}</h2>
                                                <p className="address">
                                                    <i className="fas fa-map-marker-alt" />
                                                    {myevent.address}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    You have no events. Why don´t you attend
                                    some?
                                </li>
                            )}
                        </ul>
                        {showNext && (
                            <div onClick={nextEvent} className="icon">
                                <i className="fas fa-arrow-circle-right" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="eventsThisWeek">
                <div className="weekIntro">
                    <h2>Events coming up soon</h2>
                    <Link
                        to={{
                            pathname: "/category/Show all events"
                        }}
                        className="eventBox"
                    >
                        Show More
                    </Link>
                </div>
                <div className="weekContainer">
                    {showPrevWeek && (
                        <div onClick={prevWeekEvent} className="icon">
                            <i className="fas fa-arrow-circle-left" />
                        </div>
                    )}
                    <ul>
                        {weekEvents != "" &&
                            weekEvents.map(myevent => (
                                <li key={myevent.id} className="card">
                                    <Link
                                        to={{
                                            pathname: `/events/${myevent.id}`
                                        }}
                                        className="eventLink"
                                    >
                                        <img
                                            src={
                                                myevent.eventimage ||
                                                "/sheep.jfif"
                                            }
                                        />
                                        <div className="textCard">
                                            <p className="time">
                                                {myevent.eventdate}{" "}
                                                {myevent.eventtime}
                                            </p>
                                            <h2>{myevent.name}</h2>
                                            <p className="address">
                                                <i className="fas fa-map-marker-alt" />
                                                {myevent.address}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        {showNextWeek && (
                            <div onClick={nextWeekEvent} className="icon">
                                <i className="fas fa-arrow-circle-right" />
                            </div>
                        )}
                    </ul>
                </div>
            </div>
            <div className="eventsPop">
                <div className="popIntro">
                    <h2>Most popular events</h2>
                </div>
                <div className="popContainer">
                    {showPrevPop && (
                        <div onClick={prevPopEvent} className="icon">
                            <i className="fas fa-arrow-circle-left" />
                        </div>
                    )}
                    <ul>
                        {somePopularEvents != "" &&
                            somePopularEvents.map(myevent => (
                                <li key={myevent.id} className="card">
                                    <Link
                                        to={{
                                            pathname: `/events/${myevent.id}`
                                        }}
                                        className="eventLink"
                                    >
                                        <img
                                            src={
                                                myevent.eventimage ||
                                                "/sheep.jfif"
                                            }
                                        />
                                        <div className="textCard">
                                            <p className="time">
                                                {myevent.eventdate}{" "}
                                                {myevent.eventtime}
                                            </p>
                                            <h2>{myevent.name}</h2>
                                            <p className="address">
                                                <i className="fas fa-map-marker-alt" />
                                                {myevent.address}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                    {showNextPop && (
                        <div onClick={nextPopEvent} className="icon">
                            <i className="fas fa-arrow-circle-right" />
                        </div>
                    )}
                </div>
            </div>

            <div className="browseCategory">
                <div className="categoryIntro">
                    <h2>Browse by category</h2>
                </div>
                <div className="categories">
                    {categories.map(category => (
                        <div key={category} className="category">
                            <Link to={{ pathname: `/category/${category}` }}>
                                {category}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
