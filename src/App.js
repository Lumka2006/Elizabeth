import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import Product from './Product';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';

const App = () => {
    // State to track if the user is logged in, initialized based on localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');

    // Function to handle login and set logged-in state
    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('loggedIn', 'true'); // Store login status in localStorage
    };

    // Function to handle logout and reset logged-in state
    const handleLogout = () => {
        localStorage.setItem('loggedIn', 'false'); // Update login status in localStorage
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div>
                {/* Navigation menu, visible only when the user is logged in */}
                {isLoggedIn && (
                    <nav style={{ backgroundColor: 'grey', padding: '10px' }}>
                        <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', padding: 0 }}>
                            <li>
                                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/product" style={{ color: 'white', textDecoration: 'none' }}>Product</Link>
                            </li>
                            <li>
                                <Link to="/user-management" style={{ color: 'white', textDecoration: 'none' }}>User Management</Link>
                            </li>
                            <li>
                                {/* Logout button */}
                                <button onClick={handleLogout} style={{ backgroundColor: 'grey', color: 'white', border: 'none' }}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}

                {/* Route definitions */}
                <Routes>
                    {/* Login route - redirect to dashboard if logged in, otherwise render Login component */}
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
                        }
                    />
                    {/* Dashboard route - accessible only if logged in */}
                    <Route
                        path="/dashboard"
                        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    {/* Product route - accessible only if logged in */}
                    <Route
                        path="/product"
                        element={isLoggedIn ? <Product /> : <Navigate to="/login" />}
                    />
                    {/* User Management route - accessible only if logged in, redirects to login if not */}
                    <Route
                        path="/user-management"
                        element={isLoggedIn ? <UserManagement setShowDashboard={() => setIsLoggedIn(false)} /> : <Navigate to="/login" replace />}
                    />
                    {/* Redirect any undefined route to dashboard if logged in, otherwise to login */}
                    <Route
                        path="*"
                        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App; // Export the App component
