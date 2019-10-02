import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyEvents } from "./actions";
import { changeAvatarAction } from "./actions";

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

    const hosting = useSelector(state => {
        if (state.user && state.myEvents && state.myEvents.length) {
            return state.myEvents.filter(myevent => {
                return myevent.host_id == user.id;
            });
        }
    });

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
                            src={preview || user.imageurl || "/lemon.jpg"}
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
                                                <Link to="/create">
                                                    You have no events. Why
                                                    don´t you create some?
                                                </Link>
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
                                                <Link to="/search">
                                                    You are not attending any
                                                    events. Why don´t you try
                                                    some?
                                                </Link>
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
