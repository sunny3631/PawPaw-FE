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
import DashBoard from "./pages/DashBorad";
import Survey from "./pages/Survey";
import MyPage from "./pages/MyPage";
import Etc from "./pages/Etc";
import GlobalStyles from "./styles/GlobalStyle";

function App() {
  const name = "고현림";
  const age = "22개월";
  const imgUrl = "https://i.ibb.co/k8N4d6t/6.png";

  return (
    <>
      <GlobalStyles />
      <RecoilRoot>
        {/* <CharacterCounter /> */}
        <Router>
          <Routes>
            <Route
              path="/"
              element={<DashBoard name={name} age={age} imgUrl={imgUrl} />}
            />
            <Route
              path="/survey"
              element={<Survey name={name} age={age} imgUrl={imgUrl} />}
            />
            <Route
              path="/mypage"
              element={<MyPage name={name} age={age} imgUrl={imgUrl} />}
            />
            <Route
              path="/etc"
              element={<Etc name={name} age={age} imgUrl={imgUrl} />}
            />
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
}
export default App;
