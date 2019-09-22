import React, { useEffect } from "react";
import axios from "./axios";
import { useState } from "react";
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

    const user = useSelector(state => {
        return state.user;
    });
    const eventDetails = useSelector(state => {
        return state.eventDetails;
    });

    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get("/geteventdetails/" + eventId)
            .then(response => {
                console.log(response.data);
                let details = {
                    ...response.data,
                    eventdate: moment(response.data.eventdate).format(
                        "D/M/YYYY"
                    )
                };
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
        var formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("eventtime", input.eventtime);
        formData.append("eventdate", input.eventdate);
        formData.append("location_lat", input.location_lat);
        formData.append("location_lng", input.location_lng);
        formData.append("file", file);
        console.log("POST TIME");
        axios
            .post("/updateevent/" + eventId, formData)
            .then(response => {
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
                        <LocationSearchInput setLocation={setLocation} />

                        <label htmlFor="file">Set the image of the event</label>
                        <img src={input.eventimage || "/sober.jpg"} />
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
