import React, { useEffect } from "react";
import axios from "./axios";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyEvents } from "./actions";
// import DatePicker from "react-datepicker";

export function Profile() {
    const user = useSelector(state => {
        return state.user;
    });
    const eventDetails = useSelector(state => {
        return state.eventDetails;
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyEvents());
        // return ()=>{
        //     props.resetList
        // }
    }, []);
    const showDelete = function() {
        console.log("delete me");
    };

    return (
        <div>
            {user && (
                <div className="profile">
                    <div className="imgAndDeleteContainer">
                        <img src={user.imageurl || "/sober.jpg"} />
                        <button
                            onClick={showDelete}
                            className="deleteInProfile"
                        >
                            Delete Profile
                        </button>
                    </div>
                    <div className="txtProfile">
                        <h1>
                            {user.first} {user.last}
                        </h1>
                        <div>
                            <h3>My events</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
