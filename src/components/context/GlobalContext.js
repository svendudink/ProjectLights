import { createContext, useState, useEffect, useReducer } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = (props) => {
  const [bulbIdList, setBulbIdList] = useState("");
  const [activeMap, setActiveMap] = useState("(Select)");
  const [eventList, setEventList] = useState("");
  const [eventcoords, setEventcoords] = useState("");
  const [markers, setMarkers] = useState([]);
  const [currentLampId, setCurrentLampId] = useState(1);
  const [textValue, setTextValue] = useState("");
  const [assignedBulbIds, setAssignedBulbIds] = useState([]);
  const [currentBulbId, setCurrentBulbId] = useState("not assigned");
  const [value, setValue] = useState("No ID");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [qrData, setQrData] = useState("No result");
  const [bulbConfiguratorVisibility, setBulbConfiguratorVisibility] =
    useState("hidden");

  const [filteredEventList, setFilteredEventList] = useState([
    {
      schema: "main",
      name: "Empty",
      type: "table",
      ncol: 4,
      wr: 0,
    },
  ]);
  const [center, setCenter] = useState({
    lat: 53.831777322304355,
    lng: 13.239378406704096,
  });

  console.log(markers);

  const [, forceRerender] = useReducer((x) => x + 1, 0);

  const GraphQLHandler = async (index, lat, lng, request, mapName, bulbId) => {
    // console.log("latlngcheckup", lat, lng);
    const graphqlQuery = {
      query: `mutation {MapLamps(SetMap: {bulbNumber: "${index}",lat: "${
        markers.length === 0 ? center.lat : lat
      }", lng: "${
        markers.length === 0 ? center.lng : lng
      }", request: "${request}", bulbId: "${bulbId}", mapName: "${mapName}"}){bulbIdList mapArray eventList availableBulbIdList }}`,
    };

    await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (request === "load") {
          console.log(JSON.parse(resData.data.MapLamps.mapArray)[0].lat);
          setMarkers(JSON.parse(resData.data.MapLamps.mapArray));

          setBulbIdList(JSON.parse(resData.data.MapLamps.bulbIdList));

          if (JSON.parse(resData.data.MapLamps.mapArray)[0].lat) {
            setEventcoords({
              lat: JSON.parse(resData.data.MapLamps.mapArray)[0].lat,
              lng: JSON.parse(resData.data.MapLamps.mapArray)[0].lng,
            });
          }

          forceRerender();
        } else if (request === "firstLoad") {
          setEventList(JSON.parse(resData.data.MapLamps.eventList));
          setFilteredEventList(
            JSON.parse(resData.data.MapLamps.eventList).filter(function (e) {
              return (
                e.name !== "sqlite_schema" && e.name !== "sqlite_temp_schema"
              );
            })
          );

          setBulbIdList(JSON.parse(resData.data.MapLamps.bulbIdList));
        } else if (request === "newMap") {
          GraphQLHandler(0, center.lat, center.lng, "firstLoad", textValue);
        } else if (request === "updateBulbId") {
          GraphQLHandler(0, 0, 0, "load", activeMap);
        } else if (request === "addLamp") {
          GraphQLHandler(0, 0, 0, "load", activeMap);
        }
      })
      .then()
      .catch((error) => console.log(error));
  };

  return (
    <GlobalContext.Provider
      value={{
        bulbIdList,
        setBulbIdList,
        setEventList,
        filteredEventList,
        setFilteredEventList,
        activeMap,
        setActiveMap,
        eventcoords,
        setEventcoords,
        center,
        setCenter,
        markers,
        setMarkers,
        GraphQLHandler,
        currentLampId,
        setCurrentLampId,
        textValue,
        setTextValue,
        assignedBulbIds,
        setAssignedBulbIds,
        currentBulbId,
        setCurrentBulbId,
        value,
        setValue,
        buttonPopup,
        setButtonPopup,
        qrData,
        setQrData,
        bulbConfiguratorVisibility,
        setBulbConfiguratorVisibility,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
