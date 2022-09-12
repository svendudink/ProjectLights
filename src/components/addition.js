import React, { useState, Fragment } from "react";
import ReactDOM from "react-dom";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";

function App() {
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
  const [clickedLatLng, setClickedLatLng] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
  });

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          // Store a reference to the google map instance in state
          onLoad={(map) => setMapRef(map)}
          // Save the current center position in state
          onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          center={center}
          zoom={5}
          mapContainerStyle={{
            height: "50vh",
            width: "100%",
          }}
        />

        {/* Our center position always in state */}
        <h3>
          Center {center.lat}, {center.lng}
        </h3>

        {/* Position of the user's map click */}
        {clickedLatLng && (
          <h3>
            You clicked: {clickedLatLng.lat}, {clickedLatLng.lng}
          </h3>
        )}
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
