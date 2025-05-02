// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <<< 1. IMPORT FOOTER
import ProtectedRoute from './components/ProtectedRoute';

import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Home from './pages/Home';
// Renamed imports for clarity based on file names you likely have
import LostItemForm from './pages/LostItemForm';
import FoundItemForm from './pages/FoundItemForm';
import SearchResultsPage from './pages/SearchResultsPage';
import MyReportsPage from './pages/MyReportsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ProfilePage from './pages/ProfilePage';
import About from './pages/About';
import Guidelines from './pages/Guidelines';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
// ... other page imports ...

// --- Placeholder Page Component (keep for other routes) ---
const PlaceholderPage = ({ title = "Page Content Here" }) => (
  <div className="container mx-auto p-4 min-h-[calc(100vh-150px)]"> {/* Added min-height */}
    <h1 className="text-xl font-semibold">{title}</h1>
  </div>
);

function App() {
  // TODO: Replace with real auth state later
  const isAuthenticated = true; // Example: Set to true to test protected routes easily

  return (
    <Router>
      {/* <<< 2. ADD FLEX LAYOUT WRAPPER >>> */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* <<< 3. ADD FLEX-GROW TO MAIN CONTENT AREA >>> */}
        {/* Removed pt-4 from here, apply padding inside pages or main if needed */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About/>} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/donate" element={<PlaceholderPage title="Donate Page" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<PlaceholderPage title="Careers Page" />} />
            <Route path="/:itemType/:id" element={<ItemDetailPage />} />  
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/profile" element={<ProfilePage />} />


            {/* Removed /make-payment route */}

            {/* Auth Routes */}
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/profile" replace /> : <SignupForm />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/profile" replace /> : <LoginForm />}
            />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={isAuthenticated ? <PlaceholderPage title="Profile Page (Protected)" /> : <Navigate to="/login" replace />}
            />
             <Route
            path="/my-reports" // <<<--- Define the route path
            element={isAuthenticated ? <MyReportsPage /> : <Navigate to="/login" />} // <<<--- Use the component
          />
            <Route
              path="/report-lost"
              element={isAuthenticated ? <LostItemForm /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/report-found"
              element={isAuthenticated ? <FoundItemForm /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />

            {/* Removed duplicate/unclear routes like /lostitem-form */}

            <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
          </Routes>
        </main> {/* <<< End main content area */}

        <Footer /> {/* <<< 4. ADD FOOTER COMPONENT >>> */}

      </div> {/* <<< End flex layout wrapper >>> */}
    </Router>
  );
}

export default App;