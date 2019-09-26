import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const mapStyles = {
    width: "100%",
    height: "100%"
};

export class MapWithAMarker extends Component {
    render() {
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={mapStyles}
                initialCenter={{
                    lat: -1.2884,
                    lng: 36.8233
                }}
            />
        );
    }
}
