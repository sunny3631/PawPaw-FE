import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Login from "./pages/Login";
import GlobalStyles from "./styles/GlobalStyle";
import SelectChild from "./pages/SelectChild";
import AddChild from "./pages/AddChild";
import SynchronizationChild from "./pages/SynchronizationChild";
import SynchronizationVaccination from "./pages/SynchronizationVaccination";

function App() {
  return (
    <>
      <GlobalStyles />
      <RecoilRoot>
        {/* <CharacterCounter /> */}
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select" element={<SelectChild />} />
            <Route path="/add" element={<AddChild />} />
            <Route path="/synchronization" element={<SynchronizationChild />} />
            <Route
              path="/synchronizationVaccination"
              element={<SynchronizationVaccination />}
            />
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
}
export default App;
