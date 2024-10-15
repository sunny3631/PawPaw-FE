import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import CharacterCounter from "./components/CharacterCounter";
import rep_img from "./assets/represent_image.png";
import DashBoard from "./pages/DashBorad";
import Survey from "./pages/Survey";
import MyPage from "./pages/MyPage";
import Etc from "./pages/Etc";

function App() {
  const name = "고현림";
  const imgUrl = rep_img;
  return (
    <RecoilRoot>
      {/* <CharacterCounter /> */}
      <Router>
        <Routes>
          <Route path="/" element={<DashBoard name={name} imgUrl={imgUrl} />} />
          <Route
            path="/survey"
            element={<Survey name={name} imgUrl={imgUrl} />}
          />
          <Route
            path="/mypage"
            element={<MyPage name={name} imgUrl={imgUrl} />}
          />
          <Route path="/etc" element={<Etc name={name} imgUrl={imgUrl} />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
export default App;
