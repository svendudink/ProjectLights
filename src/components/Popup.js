import React from "react";
import "./Popup.css";
import { useContext, useReducer } from "react";
import { GlobalContext } from "./context/GlobalContext";
import QrScanner from "./QrScanner.js";
import { ReactDOM } from "react";
import { QrReader } from "react-qr-reader";

function Popup(props) {
  const { buttonPopup, setButtonPopup } = useContext(GlobalContext);

  const handleClose = () => {
    setButtonPopup(false);
    ReactDOM.unmountComponentAtNode(QrReader);
  };

  console.log(buttonPopup);
  return buttonPopup ? (
    <div className="popup">
      <div className="popup-inner">
        <button onClick={handleClose} className="close-btn">
          close
        </button>
        <QrScanner />
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
