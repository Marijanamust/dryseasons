import React, { useEffect } from "react";
import axios from "./axios";
import { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
var moment = require("moment");
import PlacesAutocomplete from "react-places-autocomplete";
import { LocationSearchInput } from "./location";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails } from "./actions";
// import DatePicker from "react-datepicker";

export function Update({ eventId }) {
    const [input, setInput] = useState({});
    const [file, setFile] = useState();
    const [redirect, setRedirect] = useState(false);
    const [preview, setPreview] = useState("");
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
    const eventDetails = useSelector(state => {
        return state.eventDetails;
    });

    const inputFile = useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    useEffect(() => {
        console.log("User", user);
        axios
            .get("/geteventdetails/" + eventId)
            .then(response => {
                console.log(response.data);
                console.log(response.data.eventdate);
                let display = new Date(response.data.eventdate);
                // let mydate = moment(response.data.eventdate).format(
                //     "dddd, MMMM Do YYYY"
                // );

                let iso = display.toISOString();
                let endDate = moment(iso).format("YYYY-MM-DD");
                let details = {
                    ...response.data,
                    eventdate: endDate
                };
                console.log("display", display);
                console.log("iso", iso);
                setInput(details);
            })
            .catch(error => {
                console.log(error);
            });

        // return ()=>{
        //     props.resetList
        // }
    }, []);

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const handleClick = e => {
        e.preventDefault();
        // console.log("INPUT", input);
        // console.log("NAME", input.name);
        // console.log("DESC", input.description);
        let iso = new Date(input.eventdate).toISOString();
        console.log(iso);
        var formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("eventtime", input.eventtime);
        formData.append("eventdate", iso);
        formData.append("location_lat", input.location_lat);
        formData.append("location_lng", input.location_lng);
        formData.append("category", input.category);
        formData.append("address", input.address);
        formData.append("file", file);
        console.log("POST TIME");
        axios
            .post("/updateevent/" + eventId, formData)
            .then(response => {
                console.log("NEW DATE");
                console.log("success");
                setRedirect(true);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const addFile = e => {
        console.log("I want to add file");
        setFile(e.target.files[0]);
        console.log(URL.createObjectURL(e.target.files[0]));
        setPreview(URL.createObjectURL(e.target.files[0]));
        console.log(preview);
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
                <h2>UPDATE</h2>
                {input && (
                    <form>
                        <label htmlFor="name">Name of the event</label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            placeholder={input.name}
                            defaultValue={input.name}
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
                            {categories.map(category =>
                                category == input.category ? (
                                    <option value={category} selected>
                                        {category}
                                    </option>
                                ) : (
                                    <option value={category}>{category}</option>
                                )
                            )}
                        </select>
                        <label htmlFor="time">Time of the event</label>

                        <input
                            name="eventdate"
                            id="time"
                            type="text"
                            defaultValue={input.eventdate}
                            placeholder={input.eventdate}
                            onFocus={e => (e.target.type = "date")}
                            onBlur={e => (e.target.type = "text")}
                            onChange={handleChange}
                        />
                        <input
                            name="eventtime"
                            id="time"
                            type="time"
                            defaultValue={input.eventtime}
                            onChange={handleChange}
                        />
                        <label htmlFor="location">Location of the event</label>
                        <LocationSearchInput
                            setLocation={setLocation}
                            oldAddress={input.address}
                        />

                        <label htmlFor="file">Set the image of the event</label>
                        <img
                            src={preview || input.eventimage}
                            onClick={onButtonClick}
                        />

                        <input
                            onChange={addFile}
                            type="file"
                            id="file"
                            name="file"
                            ref={inputFile}
                            accept="image/*"
                            style={{ display: "none" }}
                            className="inputfile"
                            id="file"
                        />

                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            form="description"
                            defaultValue={input.description}
                            placeholder={input.description}
                            onChange={handleChange}
                        />
                        <button onClick={handleClick}>Submit</button>
                    </form>
                )}
                {redirect && (
                    <Redirect
                        to={{
                            pathname: `/events/${eventId}`
                        }}
                    />
                )}
            </div>
        </div>
    );
}
