import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
    <footer className="sticky-footer mt-4 mt-md-5 py-4 small">
        <div className="container d-lg-flex justify-content-between">
            <p className="text-muted mb-1 mb-lg-0">
                <span>Copyright © {(new Date()).getFullYear()} <strong>Angga Ari Wijaya</strong> </span>
                <span className="d-none d-sm-inline">all rights reserved</span>.
            </p>

            <ul className="list-inline mb-0">
                <li className="list-inline-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="list-inline-item">
                    <Link to="/help">Help</Link>
                </li>
                <li className="list-inline-item">
                    <Link to="/terms">Terms and Conditions</Link>
                </li>
            </ul>
        </div>
    </footer>
);

export default Footer;
