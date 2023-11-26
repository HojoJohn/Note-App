import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for routing
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    NoteApp
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-links">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/add-note" className="nav-links">Add Note</Link>
                    </li>
                    {/* Add other navigation items here */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
