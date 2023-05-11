import logo from './logo.svg';
import './App.css';
import './components/Home'
import Home from './components/Home';
import MoneyPool from './components/MoneyPool';
import { BrowserRouter, Route, Routes } from "react-router-dom"


function App() {
  return (
    <div className="App">
      
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/money-pool/:address" element={<MoneyPool />} />
        </Routes>
        </BrowserRouter>
        
    </div>
  );
}

export default App;
