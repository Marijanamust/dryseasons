import React from "react";
import axios from "./axios";
import { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMyEvents } from "./actions";
// import DatePicker from "react-datepicker";

import { LocationSearchInput } from "./location";

export function Create() {
    const [input, setInput] = useState({ category: "Outdoors & Adventure" });
    const [file, setFile] = useState();
    const [preview, setPreview] = useState("/sober.jpg");
    const [eventId, seteventId] = useState(false);
    const dispatch = useDispatch();
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

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const handleClick = e => {
        e.preventDefault();

        var formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("time", input.time);
        formData.append("date", input.date);
        formData.append("category", input.category);
        formData.append("location_lat", input.location_lat);
        formData.append("location_lng", input.location_lng);
        formData.append("address", input.address);
        formData.append("file", file);

        axios
            .post("/addevent", formData)
            .then(response => {
                dispatch(getMyEvents());
                seteventId(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const addFile = e => {
        setFile(e.target.files[0]);

        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const inputFile = useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const setLocation = location => {
        setInput({
            ...input,
            location_lat: location.lat,
            location_lng: location.lng,
            address: location.address
        });
    };

    return (
        <div>
            <div className="searchContainer">
                <h2>CREATE AN EVENT</h2>
                <form>
                    <label htmlFor="name">Name of the event</label>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                    <label htmlFor="name">Category of the event</label>

                    <select
                        name="category"
                        id="category"
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                    >
                        {categories.map(category => (
                            <option value={category}>{category}</option>
                        ))}
                    </select>

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
                    <label htmlFor="file">Set the image of the event</label>
                    <img src={preview} onClick={onButtonClick} />

                    <input
                        onChange={addFile}
                        type="file"
                        id="file"
                        name="file"
                        ref={inputFile}
                        accept="image/*"
                        style={{ display: "none" }}
                        className="inputfile"
                    />

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
