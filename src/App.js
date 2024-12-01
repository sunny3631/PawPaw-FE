import "./App.css";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import DashBoard from "./pages/DashBorad";
import Survey from "./pages/survey/Survey";
import SurveyResult from "./pages/survey/SurveyResult";
import SurveyList from "./pages/survey/SurveyList";
import SurveyQuestion from "./pages/survey/SurveyQuestion";
import MyPage from "./pages/MyPage";
import Etc from "./pages/Etc";
import GlobalStyles from "./styles/GlobalStyle";
import Login from "./pages/Login";
import SynchronizationChild from "./pages/SynchronizationChild";
import SelectChild from "./pages/SelectChild";
import AddChild from "./pages/AddChild";
import Vaccination from "./pages/Vaccination";
import VaccinationDetail from "./pages/VaccinationDetail"; // 상세 페이지
import MedicalHistory from "./pages/MedicalHistory";
import MedicalHistoryDetail from "./pages/MedicalHistoryDetail";
import SynchronizationVaccination from "./pages/SynchronizationVaccination";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <>
      <GlobalStyles />
      <RecoilRoot>
        {/* <CharacterCounter /> */}
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 로그인 */}
            <Route path="/login" element={<Login />} />
            {/* 자녀 추가 */}
            <Route path="/addChild" element={<AddChild />} />
            {/* 자녀 선택 */}
            <Route path="/selectChild" element={<SelectChild />} />
            {/* 자녀 동기화 */}
            <Route path="/synchronization" element={<SynchronizationChild />} />
            <Route
              path="/synchronization/vaccine/:childAddress"
              element={<SynchronizationVaccination />}
            />

            <Route
              path="/dashboard/:childAddress/:id"
              element={<DashBoard />}
            />
            {/* <Route path="/survey/:childAddress/:id" element={<Survey />} /> */}
            <Route path="/mypage/:childAddress/:id" element={<MyPage />} />
            <Route path="/etc/:childAddress/:id" element={<Etc />} />
            <Route
              path="/vaccination/:childAddress/:id"
              element={<Vaccination />}
            />
            <Route
              path="/vaccination/detail/:childAddress/:childID/:id"
              element={<VaccinationDetail />}
            />
            <Route
              path="/medicalhistory/:childAddress/:id"
              element={<MedicalHistory />}
            />
            <Route
              path="/medicalHistory/details/:childAddress/:childID/:id"
              element={<MedicalHistoryDetail />}
            />
            <Route
              path="/analysis/:childAddress/:childID"
              element={<Analysis />}
            />

            <Route path="/survey/:childAddress/:id" element={<Survey />} />

            <Route path="/surveyList/:id" element={<SurveyList />} />
            <Route path="/surveyQuestion/:id" element={<SurveyQuestion />} />
            <Route
              path="/surveyResult/:childSurveyId"
              element={<SurveyResult />}
            />
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
}
export default App;
