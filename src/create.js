import React from "react";
import axios from "./axios";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
// import DatePicker from "react-datepicker";

export function Create() {
    const [event, setEvent] = useState({});
    const [file, setFile] = useState();
    const [eventId, seteventId] = useState(false);
    // const [date, setDate] = useState(new Date());
    // const [startDate, setStartDate] = useState(new Date());

    const handleChange = e => {
        setEvent({ ...event, [e.target.name]: e.target.value });

        console.log(event);
    };
    const handleClick = e => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("name", event.name);
        formData.append("description", event.description);
        formData.append("time", event.time);
        formData.append("date", event.date);
        formData.append("location", event.location);
        formData.append("file", file);

        axios.post("/addevent", formData).then(response => {
            seteventId(response.data);
        });
    };
    const addFile = e => {
        console.log("I want to add file");

        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div className="searchContainer">
                <h2>CREATE</h2>
                <form>
                    <label htmlFor="name">Name of the event</label>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Nam"
                        onChange={handleChange}
                    />
                    <label htmlFor="time">Time of the event</label>

                    <input
                        name="date"
                        id="time"
                        type="date"
                        onChange={handleChange}
                    />
                    <input
                        name="time"
                        id="time"
                        type="time"
                        onChange={handleChange}
                    />
                    <label htmlFor="location">Location of the event</label>
                    <input
                        name="location"
                        id="location"
                        type="text"
                        onChange={handleChange}
                    />
                    <label htmlFor="location">Set the image of the event</label>
                    <img src="/sober.jpg" />
                    <input
                        onChange={addFile}
                        type="file"
                        name="file"
                        accept="image/*"
                        className="inputfile"
                        id="file"
                    />
                    <label htmlFor="file" className="fileLabel">
                        Choose a file
                    </label>

                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        form="description"
                        onChange={handleChange}
                    />
                    <button onClick={handleClick}>Submit</button>
                </form>
            </div>
            {eventId && (
                <Redirect
                    to={{
                        pathname: `/events/${eventId}`
                    }}
                />
            )}
        </div>
    );
}
