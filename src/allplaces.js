import React, { useEffect } from "react";
import axios from "./axios";
import { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyEvents } from "./actions";
import { adjustTime } from "../utils/helpers";
var moment = require("moment");
import { showEvents } from "../utils/helpers";

// import { MapWithAMarker } from "./mymapcomponent";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
// import DatePicker from "react-datepicker";

export function AllPlaces() {
    const [allMyEvents, setAllMyEvents] = useState([]);
    const [input, setInput] = useState("");
    const [time, setTime] = useState("");
    const [markers, setMarkers] = useState([]);
    const [timeOptions, setTimeOptions] = useState([
        "All events",
        "Today",
        "This week",
        "Tomorrow",
        "Next week"
    ]);
    const [isOpen, setisOpen] = useState(false);
    useEffect(() => {
        axios
            .get("/find/Show all events")
            .then(response => {
                console.log(response.data);
                let adjustAddress = response.data.map(eachEvent => {
                    console.log();
                    return {
                        ...eachEvent,
                        eventdate: moment(eachEvent.eventdate).format(
                            "dddd, MMMM Do YYYY"
                        ),
                        eventtime: moment(
                            eachEvent.eventtime,
                            "HH:mm:ss"
                        ).format("hh:mm A"),
                        location_lat: parseFloat(eachEvent.location_lat),
                        location_lng: parseFloat(eachEvent.location_lng)
                    };
                });

                setMarkers(adjustAddress);
                setAllMyEvents(adjustAddress);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const MapWithAMarker = withScriptjs(
        withGoogleMap(props => (
            <GoogleMap
                defaultZoom={12}
                defaultCenter={{ lat: 52.4870183, lng: 13.42498409999996 }}
                options={{ streetViewControl: false, mapTypeControl: false }}
            >
                {markers &&
                    markers.map((marker, index) => {
                        return (
                            <div key={index}>
                                <Marker
                                    id={marker.id}
                                    position={{
                                        lat: marker.location_lat,
                                        lng: marker.location_lng
                                    }}
                                    icon={{
                                        url:
                                            "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
                                    }}
                                    onClick={() => setisOpen(marker.id)}
                                />
                                {isOpen == marker.id && (
                                    <InfoWindow
                                        id={marker.id}
                                        position={{
                                            lat: marker.location_lat,
                                            lng: marker.location_lng
                                        }}
                                        onCloseClick={() => setisOpen(false)}
                                    >
                                        <div className="mapCard">
                                            <Link
                                                to={{
                                                    pathname: `/events/${
                                                        marker.id
                                                    }`
                                                }}
                                                className="eventLink"
                                            >
                                                <img
                                                    src={
                                                        marker.eventimage ||
                                                        "/lemon.jpg"
                                                    }
                                                />
                                                <div className="textMapCard">
                                                    <p className="time">
                                                        {marker.eventdate}{" "}
                                                        {marker.eventtime}
                                                    </p>
                                                    <h2>{marker.name}</h2>
                                                    <p className="address">
                                                        <i className="fas fa-map-marker-alt" />
                                                        {marker.address}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    </InfoWindow>
                                )}
                            </div>
                        );
                    })}
            </GoogleMap>
        ))
    );
    useEffect(
        () => {
            // let eventDate = new Date(event.eventdate);
            setMarkers(showEvents(time, allMyEvents));
        },
        [time]
    );
    const handleChange = e => {
        setTime(e.target.value);
    };

    return (
        <div className="searchMap">
            <div className="mapChoose">
                <h2>Search for events</h2>
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
            <div className="mapDiv">
                <MapWithAMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDw2suhFutPk48rmPnEWxCm9WqI7xpWp0&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div style={{ height: `500px`, width: `800px` }} />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        </div>
    );
}
