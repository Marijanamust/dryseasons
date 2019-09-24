import React from "react";
import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
var moment = require("moment");

import { useDispatch, useSelector } from "react-redux";

export function Category({ categoryName }) {
    const [myEvents, setMyEvents] = useState([]);
    const [allMyEvents, setAllMyEvents] = useState([]);
    const [input, setInput] = useState("");
    const [time, setTime] = useState("");
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

    const [timeOptions, setTimeOptions] = useState([
        "All events",
        "Today",
        "This week",
        "Tomorrow",
        "Next week"
    ]);
    const user = useSelector(state => {
        return state.user;
    });
    useEffect(
        () => {
            console.log("I am in", categoryName);
            axios
                .get("/find/" + categoryName)
                .then(response => {
                    console.log(response.data);

                    let allevents = adjustTime(response.data);
                    setAllMyEvents(allevents);
                    setMyEvents(allevents);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        [categoryName]
    );

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
    useEffect(
        () => {
            // let eventDate = new Date(event.eventdate);
            let today = moment(new Date());
            let tomorrow = moment(new Date()).add(1, "days");
            let nextWeek = moment(new Date(), "week").add(1, "week");
            let showEvents;
            if (time == "Tomorrow") {
                console.log("Im in tomorrow");
                console.log("Im in function");

                showEvents = allMyEvents.filter(eachevent => {
                    if (
                        moment(
                            eachevent.eventdate,
                            "dddd, MMMM Do YYYY"
                        ).isSame(tomorrow, "d")
                    ) {
                        return eachevent;
                    }
                });
            } else if (time == "This week") {
                console.log("im in this week");

                showEvents = allMyEvents.filter(eachevent => {
                    // console.log(new Date(eachevent.eventdate));
                    if (
                        moment(
                            eachevent.eventdate,
                            "dddd, MMMM Do YYYY"
                        ).isSame(new Date(), "week")
                    ) {
                        console.log(eachevent.eventdate);
                        return eachevent;
                    }
                });
            } else if (time == "Next week") {
                console.log("im in next week");

                showEvents = allMyEvents.filter(eachevent => {
                    // console.log(new Date(eachevent.eventdate));
                    if (
                        moment(
                            eachevent.eventdate,
                            "dddd, MMMM Do YYYY"
                        ).isSame(nextWeek, "week")
                    ) {
                        console.log(eachevent.eventdate);
                        return eachevent;
                    }
                });
            } else if (time == "Today") {
                showEvents = allMyEvents.filter(eachevent => {
                    if (
                        moment(
                            eachevent.eventdate,
                            "dddd, MMMM Do YYYY"
                        ).isSame(today, "d")
                    ) {
                        return eachevent;
                    }
                });
            } else if (time == "All events") {
                showEvents = allMyEvents;
            }

            setMyEvents(showEvents);
        },
        [time]
    );

    const handleChange = e => {
        setTime(e.target.value);
    };

    // const timeFunc = {
    //     Tomorrow: function() {
    //         console.log("Im in function");
    //
    //         let tomorrowEvents = myEvents.filter(event => {
    //             console.log(event.eventdate);
    //             var today = new Date();
    //             var tomorrow = new Date();
    //             tomorrow.setDate(today.getDate() + 1);
    //             var eventDate = new Date(event.eventdate);
    //             return eventDate == tomorrow;
    //         });
    //         setMyEvents(tomorrowEvents);
    //     },
    //     "Next week": () => {
    //         console.log("Im in function");
    //     }
    // };

    return (
        <div className="categoryContainer">
            <h2>Events this week</h2>
            <div className="allEventsContainer">
                <div className="allEvents">
                    <h2>{categoryName}</h2>
                    <select
                        name="category"
                        id="category"
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                    >
                        {timeOptions.map(timeOpt =>
                            timeOpt == time ? (
                                <option value={timeOpt} selected>
                                    {timeOpt}
                                </option>
                            ) : (
                                <option value={timeOpt}>{timeOpt}</option>
                            )
                        )}
                    </select>
                    <div className="yourContainer">
                        <ul>
                            {myEvents && myEvents != "" ? (
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
                                    No events yet in this category. Why dont you
                                    create some?
                                </li>
                            )}
                        </ul>
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
        </div>
    );
}
