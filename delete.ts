// const MapLamps = async function ({ SetMap }: any) {
//   console.log("checkPromiseError");
//   return new Promise((resolve, reject) => {
//     let loadMap: boolean = false;
//     console.log("isload?", SetMap.bulbNumber);
//     if (SetMap.bulbNumber === "load") {
//       loadMap = true;
//     }
//     console.log("lampInfo", SetMap.bulbNumber, SetMap.lat, SetMap.lng);
//     const lampMapArray: any = [];

//     lampMapArray.push({
//       bulbNumber: SetMap.bulbNumber,
//       lat: SetMap.lat,
//       lng: SetMap.lng,
//     });

//     db.get(
//       `SELECT * FROM blogs2 WHERE id = "${SetMap.bulbNumber}"`,
//       (err, rows) => {
//         if (rows === undefined) {
//           console.log("error", err);
//           db.run(
//             `CREATE TABLE blogs2 (id text, lat text,lng text,intro text)`,
//             (err) => {
//               //console.log(err);
//               // Table already created

//               // Table just created, creating some rows
//               let insert =
//                 "INSERT INTO blogs2 (id ,lat, lng, intro) VALUES (?,?,?,?)";
//               if (loadMap === false) {
//                 lampMapArray.map((blog: any) => {
//                   db.run(insert, [
//                     `${blog.bulbNumber}`,
//                     `${blog.lat}`,
//                     `${blog.lng}`,
//                     `${blog.lng}`,
//                   ]);
//                 });
//               }
//             }
//           );
//         } else {
//           if (loadMap === false) {
//             db.run(
//               `CREATE TABLE blogs2 (id text, lat text,lng text,intro text)`,
//               (err) => {
//                 console.log(err);
//                 // Table already created

//                 // Table just created, creating some rows
//                 console.log("testiii", SetMap.bulbNumber);
//                 let insert = `UPDATE blogs2 SET lat = ?, lng = ? WHERE id = ?`;
//                 lampMapArray.map((blog: any) => {
//                   db.run(
//                     insert,
//                     [`${blog.lat}`, `${blog.lng}`, `${blog.bulbNumber}`],
//                     function (err) {
//                       if (err) {
//                         return console.log(err.message);
//                       } else {
//                       }
//                     }
//                   );
//                 });
//               }
//             );
//           }
//           db.all(`SELECT * FROM blogs2`, (err, table) => {
//             if (err) reject(err);
//             resolve({ mapArray: JSON.stringify(table) });
//           });
//         }
//       }
//     );
//   });
// };

import React, { useState, useReducer, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import GoogleMapMarker from "./GoogleMapMarker";
import IconMenu from "./IconMenu";

const GoogleMapComponent = (props) => {
  //Starting coords
  let startLat = 53.831777322304355;
  let startLng = 13.239378406704096;

  let markersList = [];

  //send to nodeJS and receive from

  console.log(JSON.stringify(markersList));

  //end of send and receive form nodejs

  let [markers, setMarkers] = useState(markersList);

  const [, forceRerender] = useReducer((x) => x + 1, 0);

  const mapStyles = {
    width: "100%",
    height: "100%",
    mapTypeId: "satellite",
  };

  const changeHandler = async (index, lat, lng, request) => {
    console.log("latlngcheckup", lat, lng);
    const graphqlQuery = {
      query: `mutation {MapLamps(SetMap: {bulbNumber: "${index}",lat: "${
        markers.length === 0 ? startLat : lat
      }", lng: "${
        markers.length === 0 ? startLng : lng
      }", request: "${request}"}){mapArray}}`,
    };

    console.log(markers);

    await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (request === "load") {
          setMarkers(JSON.parse(resData.data.MapLamps.mapArray));
          forceRerender();
        }
        console.log("fetchworked", JSON.parse(resData.data.MapLamps.mapArray));
      })
      .catch((error) => console.log(error));
  };
  // here is the error. something with the length

  let addNewLamp = (test) => {
    forceRerender();
    let finalLat = 0;
    let finalLng = 0;
    markers.forEach((element) => {
      console.log(typeof element.lat);
      finalLat = finalLat + Number(element.lat);
      finalLng = finalLng + Number(element.lng);
    });
    const lat = markers.length === 0 ? finalLat / markers.length : startLat;
    const lng = markers.length === 0 ? finalLng / markers.length : startLng;
    const ind = markers.length === 0 ? 1 : markers.length;

    changeHandler(ind, lat, lng, "addLamp");
    markers[ind] = { id: ind, lat, lng };
    console.log("onmarkerAdd", markers);
    setMarkers(markers);
  };

  let onMarkerDragEnd = (coord, index, markers, id) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    markers[index] = { lat, lng };

    console.log("onMarkerdRAG", markers);
    setMarkers(markers);
    changeHandler(id, lat, lng, "update");
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
        onClick={() => console.log("Clicked")}
        draggable={true}
        onDragend={(t, map, coord) =>
          onMarkerDragEnd(coord, key, markers, val.id)
        }
      />
    ));
  return (
    <>
      <div>
        {markers && <div>{`${markers}`}</div>}
        <div className="row d-flex justify-content-center text-center">
          <h1>
            <button onClick={() => addNewLamp()}>add new lamp</button>
            <button onClick={() => changeHandler(0, 0, 0, "load")}>
              kiez burn map
            </button>
          </h1>
          <Map
            onChange={() => addNewLamp()}
            google={props.google}
            zoom={18}
            style={mapStyles}
            initialCenter={{
              lat: startLat,
              lng: startLng,
            }}
          >
            {myMarkers}
          </Map>
        </div>
      </div>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyD2ZcdhauruGPbtzIEqEMPWERuq9x8FVxA",
})(GoogleMapComponent);
