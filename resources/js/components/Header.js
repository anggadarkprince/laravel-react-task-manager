import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div className='container'>
            <Link className='navbar-brand' to='/'>Tasks Manager</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className='nav-link' to='/'>
                            <i className='mdi mdi-speedometer-slow mr-1'/>Home <span className="sr-only">(current)</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to='/projects'>
                            <i className='mdi mdi-ballot-outline mr-1'/>Projects
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to='/archive'>
                            <i className='mdi mdi-archive-outline mr-1'/>Archive
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to='/setting'>
                            <i className='mdi mdi-settings-outline mr-1'/>Setting
                        </Link>
                    </li>
                </ul>
                <form className="form-inline my-2 my-md-0 mr-md-4">
                    <div className='input-group'>
                        <input className="form-control form-control-sm" type="search" placeholder="Search project or task" aria-label="Search"/>
                        <div className="input-group-append">
                            <button className="btn btn-sm btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </div>
                    </div>
                </form>
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Account
                        </a>
                        <div className="dropdown-menu dropdown-menu-right border-0 shadow" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#">
                                <i className='mdi mdi-account-outline mr-1'/>My Account
                            </a>
                            <a className="dropdown-item" href="#">
                                <i className='mdi mdi-tune mr-1'/>Setting
                            </a>
                            <div className="dropdown-divider"/>
                            <a className="dropdown-item" href="#">
                                <i className='mdi mdi-logout mr-1'/>Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Header;
