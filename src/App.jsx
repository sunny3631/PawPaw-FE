import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Login from "./pages/Login";

function App() {
  return (
    <RecoilRoot>
      {/* <CharacterCounter /> */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
export default App;
