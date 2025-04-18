import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import About from './pages/About';
// import Guidelines from './pages/Guidelines';
// import Disclaimer from './pages/Disclaimer';
// import Donate from './pages/Donate';
// import Contact from './pages/Contact';
// import Careers from './pages/Careers';
// import MakePayment from './pages/MakePayment';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/guidelines" element={<Guidelines />} /> */}
        {/* <Route path="/disclaimer" element={<Disclaimer />} /> */}
        {/* <Route path="/donate" element={<Donate />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/careers" element={<Careers />} /> */}
        {/* <Route path="/make-payment" element={<MakePayment />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
