import React, { useState, useReducer } from "react";
import { Marker } from "google-maps-react";

export default function GoogleMapMarker(props) {
  let markersList = [
    { lat: 23.024, lng: 72.580276 },
    { lat: 23.0063, lng: 72.6026 },
    { lat: 23.0163, lng: 72.6026 },
    { lat: 23.015533333333334, lng: 72.59515866666666 },
  ];
  let [markers, setMarkers] = useState(markersList);
  const mapStyles = {
    width: "100%",
    height: "100%",
  };

  let addNewLamp = (test) => {
    let finalLat = 0;
    let finalLng = 0;
    markersList.forEach((element) => {
      console.log(typeof element.lat);
      finalLat = finalLat + Number(element.lat);
      finalLng = finalLng + Number(element.lng);
    });
    markersList.push({
      lat: finalLat / markersList.length,
      lng: finalLng / markersList.length,
    });
    console.log(markersList);
    setMarkers(markersList);
    console.log(markers);
  };

  let onMarkerDragEnd = (coord, index, markers) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    markers[index] = { lat, lng };
    setMarkers(markers);
    console.log(markers);
  };

  let myMarkers =
    markers &&
    Object.entries(markers).map(([key, val, ind]) => (
      <Marker
        key={key}
        icon={{
          url: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red${
            Number(key) + 1
          }.png`,
        }}
        id={key}
        position={{
          lat: val.lat,
          lng: val.lng,
        }}
        onClick={() => console.log("Clicked")}
        draggable={true}
        onDragend={(t, map, coord) => onMarkerDragEnd(coord, key, markers)}
      />
    ));

  return <div>{myMarkers}</div>;
}
