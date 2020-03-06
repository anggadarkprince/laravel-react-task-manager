import React from "react";

export default Error404 => (
    <div className="d-flex align-items-center justify-content-center text-center" style={{height: 'calc(100vh - 250px)'}}>
        <div className="px-3">
            <h1 className="display-1">404</h1>
            <h1>Page Not Found</h1>
            <p className="lead text-muted">The page you’re looking for was not found.</p>
            <a className="btn btn-primary mt-2" href="/">
                Back to home
            </a>
        </div>
    </div>
);
