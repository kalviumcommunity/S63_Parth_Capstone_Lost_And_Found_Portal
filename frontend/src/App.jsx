// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- Import Footer
import Home from './pages/Home';
import Signup from './pages/Signup'; // <-- Import Signup page
// ... other page imports

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col"> {/* Added flex container */}
        <Navbar />
        <main className="flex-grow"> {/* Added main section */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} /> 
            {/* ... other routes */}
          </Routes>
        </main>
        <Footer /> {/* <-- Add Footer here */}
      </div>
    </Router>
  );
}

export default App;