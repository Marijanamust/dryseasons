import React, { useEffect } from "react";
import axios from "./axios";
import { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyEvents } from "./actions";
import { changeAvatarAction } from "./actions";
// import DatePicker from "react-datepicker";

export function Profile() {
    const [file, setFile] = useState("");
    const user = useSelector(state => {
        return state.user;
    });
    const myEvents = useSelector(state => {
        return state.myEvents;
    });
    const [preview, setPreview] = useState("");
    const dispatch = useDispatch();
    const inputFile = useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const addFile = e => {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const changeAvatar = () => {
        var formData = new FormData();
        formData.append("file", file);
        dispatch(changeAvatarAction(formData));
        setFile("");
    };

    useEffect(() => {
        dispatch(getMyEvents());
    }, []);
    const showDelete = function() {
        console.log("delete me");
    };

    const hosting = useSelector(state => {
        if (state.user && state.myEvents && state.myEvents.length) {
            console.log("in block", state.myEvents);
            return state.myEvents.filter(myevent => {
                console.log(myevent.host_id, user.id);
                return myevent.host_id == user.id;
            });
        }
    });
    {
        hosting && console.log("hosting", hosting);
    }

    const attending = useSelector(state => {
        if (state.user && state.myEvents && state.myEvents.length) {
            return state.myEvents.filter(myevent => {
                return myevent.host_id != user.id;
            });
        }
    });

    return (
        <div>
            {user && (
                <div className="profile">
                    <div className="imgAndDeleteContainer">
                        <img
                            src={preview || user.imageurl}
                            onClick={onButtonClick}
                        />
                        <h1>
                            {user.first} {user.last}
                        </h1>
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
                        {file != "" && (
                            <button
                                onClick={changeAvatar}
                                className="uploadImg"
                            >
                                Upload image
                            </button>
                        )}
                    </div>

                    {user && myEvents && (
                        <div className="profileEvents">
                            <h2>Hosting</h2>
                            <div className="hostContainer">
                                <div className="ulDiv">
                                    <ul>
                                        {hosting && hosting != "" ? (
                                            hosting.map(myevent => (
                                                <li
                                                    key={myevent.id}
                                                    className="card"
                                                >
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
                                                                {
                                                                    myevent.eventdate
                                                                }{" "}
                                                                {
                                                                    myevent.eventtime
                                                                }
                                                            </p>
                                                            <h2>
                                                                {myevent.name}
                                                            </h2>
                                                            <p className="address">
                                                                <i className="fas fa-map-marker-alt" />
                                                                {
                                                                    myevent.address
                                                                }
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>
                                                You have no events. Why don´t
                                                you create some?
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <h2>Attending</h2>
                            <div className="attendContainer">
                                <div className="ulDiv">
                                    <ul>
                                        {attending && attending != "" ? (
                                            attending.map(myevent => (
                                                <li
                                                    key={myevent.id}
                                                    className="card"
                                                >
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
                                                                {
                                                                    myevent.eventdate
                                                                }{" "}
                                                                {
                                                                    myevent.eventtime
                                                                }
                                                            </p>
                                                            <h2>
                                                                {myevent.name}
                                                            </h2>
                                                            <p className="address">
                                                                <i className="fas fa-map-marker-alt" />
                                                                {
                                                                    myevent.address
                                                                }
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>
                                                You have no events. Why don´t
                                                you attend some?
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
