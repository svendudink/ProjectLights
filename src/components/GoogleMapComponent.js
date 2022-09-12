import React, { useState, useReducer, useContext } from "react";
import { useGoogleMap, Map, GoogleApiWrapper, Marker } from "google-maps-react";
import IconMenu from "./IconMenu";
import { TextField } from "@mui/material";
import { GlobalContext } from "./context/GlobalContext";
import QrScanner from "./QrScanner";
import Popup from "./Popup";

const GoogleMapComponent = (props) => {
  //Starting coords

  // const GraphQLHandler = GraphQLHandler();

  // setting list of locations with specs, find solution for lat lng for gps position

  const {
    bulbIdList,

    eventcoords,
    setEventcoords,
    activeMap,
    setActiveMap,
    filteredEventList,
    setFilteredEventList,
    center,
    setCenter,
    markers,
    setMarkers,
    GraphQLHandler,
    currentLampId,
    setCurrentLampId,
    textValue,
    setTextValue,
    setCurrentBulbId,
    setValue,
    buttonPopup,
    bulbConfiguratorVisibility,
    setBulbConfiguratorVisibility,
  } = useContext(GlobalContext);

  //send to nodeJS and receive from

  const handleClick = (e, num) => {
    console.log("checkevent", e.target, num);
  };

  //end of send and receive form nodejs

  const [, forceRerender] = useReducer((x) => x + 1, 0);

  const mapStyles = {
    width: "70%",
    height: "100%",
  };

  let addNewLamp = () => {
    const lat = center.lat;
    const lng = center.lng;
    const ind = markers.length === 0 ? 1 : markers.length;
    const newId =
      markers.length === 0 ? 1 : Number(markers[markers.length - 1].id) + 1;
    console.log(newId);

    let err = markers.filter((e) => {
      return e.id === ind;
    });
    console.log(ind);

    console.log(activeMap);
    GraphQLHandler(newId, lat, lng, "addLamp", activeMap);
    markers[markers.length] = { id: newId, lat, lng };
    console.log("onmarkerAdd", markers);
    setMarkers(markers);

    forceRerender();
  };

  let onMarkerDragEnd = (coord, index, markers, lampId, map, t) => {
    console.log(map, t);
    const { latLng } = coord;
    const lat = latLng.lat().toString();
    const lng = latLng.lng().toString();
    const id = lampId.toString();
    const bulbId = markers[index].bulbId;
    markers[index] = { id, lat, lng, bulbId };

    console.log("onMarkerdRAG", markers);
    setMarkers(markers);
    GraphQLHandler(id, lat, lng, "update", activeMap);
  };

  let createNewMap = (e) => {
    GraphQLHandler(0, center.lat, center.lng, "newMap", textValue);
    console.log(Map);
    forceRerender();
  };

  let firstLoad = (e) => {
    GraphQLHandler(0, center.lat, center.lng, "firstLoad", textValue);
  };
  if (bulbIdList === "") {
    firstLoad();
  }

  let openMenu = (e) => {
    console.log(e);
    setCurrentLampId(e);
    console.log(markers, e);
    let temp = markers.filter((marker) => {
      return marker.id === e;
    });
    console.log(temp[0].bulbId);
    setCurrentBulbId(temp[0].bulbId);
    setValue(temp[0].bulbId);
  };

  let inputText = (input) => {
    setTextValue(input.target.value);
  };
  // send center coords to backend and create new map, easy peasy
  let clickstat = (e, map, coord) => {
    setCenter({ lat: map.center.lat(), lng: map.center.lng() });
    console.log(e, map);
    setEventcoords({ lat: map.center.lat(), lng: map.center.lng() });
  };

  const handleChange = (event) => {
    setMarkers([]);
    console.log("dropdown", event.target.value);

    if (event.target.value === "Select") {
      setActiveMap("(Select)");
      setBulbConfiguratorVisibility("hidden");
    } else {
      setActiveMap(event.target.value);
      setBulbConfiguratorVisibility("visible");

      GraphQLHandler(0, 0, 0, "load", event.target.value);
    }
  };
  console.log(filteredEventList, activeMap);

  const deleteMap = () => {
    setMarkers([]);
    GraphQLHandler("id", "lat", "lng", "delete", activeMap);
    let temp;
    temp = filteredEventList.filter((e) => {
      return e.name !== activeMap;
    });
    setFilteredEventList(temp);
    setActiveMap("(Select)");
  };

  const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={activeMap} onChange={onChange}>
          <option value={"Select"}>{"(Select)"}</option>
          {options.map((option) => (
            <option value={option.name}>{option.name}</option>
          ))}
        </select>
      </label>
    );
  };

  let myMarkers =
    markers &&
    Object.entries(markers).map(([key, val, ind]) => (
      <Marker
        key={key}
        icon={{
          url: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red${
            val.id ? val.id : 1
          }.png`,
        }}
        id={key}
        position={{
          lat: val.lat,
          lng: val.lng,
        }}
        onClick={() => openMenu(val.id ? val.id : 1)}
        draggable={true}
        location={"supersecret"}
        onDragend={(t, map, coord) =>
          onMarkerDragEnd(coord, key, markers, val.id, t, map)
        }
      />
    ));

  return (
    <>
      <div>
        {markers && <div></div>}
        <div className="row d-flex justify-content-center text-center">
          <h1>
            <button
              disabled={activeMap === "(Select)" ? true : false}
              onClick={() => addNewLamp()}
            >
              add new lamp
            </button>

            {
              <div>
                <Dropdown
                  label="Event name:"
                  options={filteredEventList}
                  value={activeMap}
                  onChange={handleChange}
                />
              </div>
            }

            <button
              onClick={deleteMap}
              disabled={activeMap === "(Select)" ? true : false}
            >
              Delete map
            </button>

            <div>new map name:</div>
            <TextField value={textValue} onChange={inputText}></TextField>
            <button onClick={() => createNewMap()}>Add new map</button>
          </h1>
          <Map
            // onCenterChanged={(e, map, coord) => clickstat(e, map, coord)}

            onDragend={(e, map, coord) => clickstat(e, map, coord)}
            google={props.google}
            zoom={18}
            onClick={clickstat}
            style={mapStyles}
            center={{
              lat: eventcoords.lat,
              lng: eventcoords.lng,
            }}
            initialCenter={{
              lat: center.lat,
              lng: center.lng,
            }}
          >
            {myMarkers}

            <div
              style={{
                position: "absolute",
                left: `${10}px`,
                top: `${60}px`,
                visibility: `${bulbConfiguratorVisibility}`,
              }}
            >
              <IconMenu
                id={currentLampId}
                handleClick={handleClick}
                bulbIdList={bulbIdList}
              />
            </div>
            <div>
              <Popup trigger={buttonPopup} />
            </div>
          </Map>
        </div>
      </div>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyD2ZcdhauruGPbtzIEqEMPWERuq9x8FVxA",
})(GoogleMapComponent);
