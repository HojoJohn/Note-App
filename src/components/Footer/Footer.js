import React from 'react';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <span>&copy; {currentYear} NoteApp. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
