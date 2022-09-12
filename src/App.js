import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import { GlobalContextProvider } from "./components/context/GlobalContext";
import DrawerAppBar from "./components/DrawerAppBar";
import BasicController from "./views/BasicController";
import CreateMapping from "./views/CreateMapping";

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <div className="App">
          <DrawerAppBar />
          <Routes>
            <Route path="/BasicController" element={<BasicController />} />
            <Route path="/CreateMapping" element={<CreateMapping />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

export default App;
