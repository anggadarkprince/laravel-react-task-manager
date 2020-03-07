import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: props.q || '',
        };
    }

    onSearch(e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/search',
            search: '?' + new URLSearchParams({q: this.state.keyword}).toString()
        });
        this.props.onUpdateKeyword(this.state.keyword);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.q !== this.props.q) {
            this.setState({keyword: this.props.q});
        }
    }

    onLogout(e) {
        e.preventDefault();

        this.props.setAuthState(false);
        this.props.history.push('/login');
    }

    render() {
        const {location} = this.props;
        return (
            <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
                <div className='container'>
                    <Link className='navbar-brand' to='/'>Tasks Manager</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className={`nav-item${location.pathname === '/' ? ' active' : ''}`}>
                                <Link className='nav-link' to='/'>
                                    <i className='mdi mdi-speedometer-slow mr-1'/>Home <span
                                    className="sr-only">(current)</span>
                                </Link>
                            </li>
                            <li className={`nav-item${location.pathname.startsWith('/projects') ? ' active' : ''}`}>
                                <Link className='nav-link' to='/projects'>
                                    <i className='mdi mdi-ballot-outline mr-1'/>Projects
                                </Link>
                            </li>
                            <li className={`nav-item${location.pathname.startsWith('/archive') ? ' active' : ''}`}>
                                <Link className='nav-link' to='/archive'>
                                    <i className='mdi mdi-archive-outline mr-1'/>Archive
                                </Link>
                            </li>
                            <li className={`nav-item${location.pathname.startsWith('/setting') ? ' active' : ''}`}>
                                <Link className='nav-link' to='/setting'>
                                    <i className='mdi mdi-settings-outline mr-1'/>Setting
                                </Link>
                            </li>
                        </ul>
                        <form onSubmit={this.onSearch.bind(this)} className="form-inline my-2 my-md-0 mr-md-4">
                            <div className='input-group'>
                                <input className="form-control form-control-sm" type="search" value={this.state.keyword}
                                       onChange={(e) => this.setState({keyword: e.target.value})}
                                       placeholder="Search project or task" aria-label="Search" required/>
                                <div className="input-group-append">
                                    <button className="btn btn-sm btn-outline-success" type="submit">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Account
                                </a>
                                <div className="dropdown-menu dropdown-menu-right border-0 shadow"
                                     aria-labelledby="navbarDropdown">
                                    <Link to='/account' className="dropdown-item">
                                        <i className='mdi mdi-account-outline mr-1'/>My Account
                                    </Link>
                                    <Link to='/setting' className="dropdown-item">
                                        <i className='mdi mdi-settings-outline mr-1'/>Setting
                                    </Link>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="/logout" onClick={this.onLogout.bind(this)}>
                                        <i className='mdi mdi-logout mr-1'/>Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default withRouter(Header);
