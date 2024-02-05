import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Quiz from "./component/Quiz";
import Homepage from "./component/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/quiz" element={<Quiz/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
