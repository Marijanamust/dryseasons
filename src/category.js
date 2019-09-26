import React from "react";
import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
var moment = require("moment");
import { showEvents, adjustTime } from "../utils/helpers";

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
        "Weird",
        "Show all events"
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
            window.scrollTo(0, 0);

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

    useEffect(
        () => {
            // let eventDate = new Date(event.eventdate);
            setMyEvents(showEvents(time, allMyEvents));
        },
        [time]
    );

    const handleChange = e => {
        setTime(e.target.value);
    };

    return (
        <div className="categoryContainer">
            <div className="categoryIntro">
                <h2>{categoryName}</h2>
                <div className="categoryChoose">
                    <h1>Events this week</h1>
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
                </div>
            </div>
            <div className="allcategoryContainer">
                <div className="allEvents">
                    <div className="yourContainer">
                        <ul className="categoryUl">
                            {myEvents && myEvents != "" ? (
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
                                    No events yet in this category. Why dont you
                                    create some?
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="browseCategory">
                    <div className="categoryIntro">
                        <h2>Other categories</h2>
                    </div>
                    <div className="categories">
                        {categories.map(category => (
                            <div key={category} className="category">
                                <Link
                                    to={{ pathname: `/category/${category}` }}
                                >
                                    {category}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
