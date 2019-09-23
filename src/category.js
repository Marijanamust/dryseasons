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
    useEffect(
        () => {
            console.log("I am in", categoryName);
            axios
                .get("/find/" + categoryName)
                .then(response => {
                    console.log(response.data);

                    let myevents = adjustTime(response.data);
                    setAllMyEvents(myevents);
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

    return (
        <div className="categoryContainer">
            <h2>Events this week</h2>

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
