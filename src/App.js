import './App.css';
import MainPage from "./pages/MainPage" 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue,} from 'recoil';
import CharacterCounter from './components/CharacterCounter'; 
  
function App() {
  return (
    <RecoilRoot>
       {/* <CharacterCounter /> */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
                         
        </Routes>
      </Router>
    </RecoilRoot>
 
  );
}
export default App;
