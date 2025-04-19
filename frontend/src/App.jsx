// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... other imports
import SignupForm from './pages/SignupForm'; // Import the component

function App() {
    return (
        <Router>
            {/* <Navbar /> */}
            <Routes>
                {/* ... other routes */}
                <Route path="/signup" element={<SignupForm />} />
                {/* ... other routes */}
            </Routes>
            {/* <Footer /> */}
        </Router>
    );
}

export default App;