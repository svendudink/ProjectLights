import { useContext } from "react";
import GoogleMapComponent from "../components/GoogleMapComponent";
import EnhancedTable from "../components/EnhancedTable";
import "./CreateMapping.css";
import { GlobalContext } from "../components/context/GlobalContext";

const CreateMapping = () => {
  return (
    <div>
      <div className="googleMap">
        <GoogleMapComponent />
      </div>
      <div className="table">
        <EnhancedTable />
      </div>
    </div>
  );
};

export default CreateMapping;
