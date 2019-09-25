import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export function Welcome() {
    const [modal, setModal] = useState(false);
    const [firstModal, setFirstModal] = useState(false);

    useEffect(() => {
        setTimeout(function() {
            setFirstModal(true);
        }, 2000);

        setTimeout(function() {
            setFirstModal(false);
            setModal(true);
        }, 6000);
    }, []);

    return (
        <div className="welcomeContainer">
            <video autoPlay muted id="myVideo" loop>
                <source src="/Lonely-Chair.mp4" type="video/mp4" />
            </video>

            <div className="content">
                {firstModal && <h1 className="firstModal">Feeling down?</h1>}
                {modal && (
                    <div className="modal">
                        <h2>Enter the world of sober possibilities</h2>
                        <h1>Dry Seasons</h1>
                        <div className="enter">
                            <a href="/search" id="enterH1">
                                ENTER
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
