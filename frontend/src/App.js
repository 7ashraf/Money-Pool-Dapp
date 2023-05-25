import './components/Home'
import Home from './components/Home';
import MoneyPool from './components/MoneyPool';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="App">
      
        <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/money-pool/:address" element={<MoneyPool />} />
        </Routes>
        </BrowserRouter>
        
    </div>
  );
}

export default App;
