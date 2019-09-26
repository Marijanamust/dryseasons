import React, { useEffect } from "react";
import axios from "./axios";
import { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyEvents } from "./actions";
import { adjustTime } from "../utils/helpers";
var moment = require("moment");

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
    const [markers, setMarkers] = useState([
        { id: 1, lat: 52.4870183, lng: 13.42498409999996, description: "wow" },
        {
            id: 2,
            lat: 52.4986146,
            lng: 13.43135099999995,
            description: "wowsie"
        }
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

    return (
        <div>
            <h1>Im here</h1>
            <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDw2suhFutPk48rmPnEWxCm9WqI7xpWp0&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `600px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}
