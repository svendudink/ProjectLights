import { Button } from "@mui/material";
import { useState, useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Draggable from "react-draggable";
import { GlobalContext } from "../components/context/GlobalContext";

const BasicController = () => {
  const { filteredEventList, GraphQLHandler, bulbIdList } =
    useContext(GlobalContext);

  const [bulbMovement, setBulbMovement] = useState("0");
  const [bulbColours, setbulbColours] = useState("0");
  const [mapping, setMapping] = useState("0");

  let firstLoad = (e) => {
    GraphQLHandler(0, "center.lat", "center.lng", "firstLoad", "textValue");
  };
  if (bulbIdList === "") {
    firstLoad();
  }

  const clickHandler = async (e) => {
    console.log("mapping", mapping.target.value);
    console.log("checkingtest", e.target.id);
    const graphqlQuery = {
      query: `mutation {ControlDevice(SetValues: {sendToAndroid: "${
        e.target.id === "0" ? true : false
      }", createLightFile: "${e.target.id === "1" ? true : false}",mapping: "${
        mapping.target.value
      }", readFileFromAndroid: "${
        e.target.id === "2" ? true : false
      }", bulbMovement: "${
        bulbMovement === "0" ? "0" : bulbMovement.target.value
      }", bulbColours: "${
        bulbColours === "0" ? "0" : bulbColours.target.value
      }"}){notDefined}}`,
    };

    await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData);
      });
  };

  console.log("test");
  console.log(bulbMovement);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Bulb travel pattern</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={bulbMovement === "0" ? "0" : bulbMovement.target.value}
          label="Bulb travel pattern"
          onChange={setBulbMovement}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value={"0"}>Breathing whole group</MenuItem>
          <MenuItem value={"2"}>Up and down random</MenuItem>
          <MenuItem value={"1"}>Fully random</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Bulb Colours</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={bulbColours === "0" ? "0" : bulbColours.target.value}
          label="Bulb travel pattern"
          onChange={setbulbColours}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value={"0"}>Full random colours</MenuItem>
          <MenuItem value={"1"}>Specified colours, set in backend</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Mapping</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={mapping === "0" ? "0" : mapping.target.value}
          label="Mapping"
          onChange={setMapping}
        >
          <MenuItem value=""></MenuItem>
          {filteredEventList.map((option) => {
            return <MenuItem value={option.name}>{option.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <br></br>
      <br></br>
      <Button id={1} onClick={clickHandler} variant="contained">
        Create LightFile
      </Button>
      <br></br>
      <br></br>
      <Button id={0} onClick={clickHandler} variant="contained">
        Reboot Device in download mode and write lightfile to phone
      </Button>
      <br></br>
      <br></br>
      <div></div>
      <Button id={2} onClick={clickHandler} variant="contained">
        Read file from android
      </Button>
      <Draggable>
        <div>I can now be moved around!</div>
      </Draggable>
    </div>
  );
};

export default BasicController;
