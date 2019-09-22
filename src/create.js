import React from "react";
import axios from "./axios";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
// import DatePicker from "react-datepicker";
import PlacesAutocomplete from "react-places-autocomplete";
import { LocationSearchInput } from "./location";

export function Create() {
    const [input, setInput] = useState({});
    const [file, setFile] = useState();
    const [eventId, seteventId] = useState(false);
    // const [date, setDate] = useState(new Date());
    // const [startDate, setStartDate] = useState(new Date());

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });

        console.log(input);
    };
    const handleClick = e => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("time", input.time);
        formData.append("date", input.date);
        formData.append("location_lat", input.location_lat);
        formData.append("location_lng", input.location_lng);
        formData.append("file", file);

        axios.post("/addevent", formData).then(response => {
            seteventId(response.data);
        });
    };
    const addFile = e => {
        console.log("I want to add file");

        setFile(e.target.files[0]);
    };

    const setLocation = location => {
        setInput({
            ...input,
            location_lat: location.lat,
            location_lng: location.lng
        });
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

                    <LocationSearchInput setLocation={setLocation} />
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
