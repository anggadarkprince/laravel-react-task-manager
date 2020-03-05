import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Projects from './projects/Projects';
import Dashboard from "./home/Dashboard";
import Help from './statics/Help';
import Terms from './statics/Terms';
import Archive from "./archive/Archive";
import Search from "./search/Search";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Verification from "./auth/Verification";
import axios from "axios";

class App extends Component {

    constructor (props) {
        super(props);
        let params = new URLSearchParams(window.location.search.substring(1));
        this.state = {
            authCheck: true,
            isLoggedIn: false,
            q: params.get("q") || '',
        };
    }

    componentDidMount() {
        this.checkAuthState();
    }

    onUpdateKeyword(q) {
        this.setState({q: q});
    }

    onClearKeyword() {
        this.setState({q: ''});
    }

    checkAuthState() {
        const guest = ['/login', '/register'];
        const apiToken = localStorage.getItem('api_token');
        if(apiToken) {
            axios.interceptors.request.use(function (config) {
                config.headers.Authorization = 'Bearer ' + apiToken;
                return config;
            });
            axios.get('/api/user').then(response => {
                this.setState({authCheck: false});
                if (response.data.id) {
                    this.setAuthState(true);
                    if(guest.includes(window.location.pathname)) {
                        window.location = '/';
                    }
                } else {
                    this.setAuthState(false);
                }
            }).catch(error => {
                console.log(error);
                this.setAuthState(false);
            });
        } else {
            if(!guest.includes(window.location.pathname)) {
                window.location = '/login';
            } else {
                this.setState({ authCheck: false });
            }
        }
    }

    setAuthState(state) {
        this.setState({ isLoggedIn: state, authCheck: false });
        if(!state) {
            localStorage.removeItem('api_token');
        }
    }

    render () {
        return (
            <BrowserRouter>
                {this.state.isLoggedIn ? <Header setAuthState={this.setAuthState.bind(this)} onUpdateKeyword={this.onUpdateKeyword.bind(this)} q={this.state.q} /> : null}
                {this.state.authCheck ? null : (
                    <React.Fragment>
                        <div className='container py-4' style={{minHeight: 'calc(100vh - 175px)'}}>
                            <Switch>
                                <Route exact path='/' component={Dashboard} />
                                <Route exact path='/login' render={(props) => <Login {...props} checkAuthState={this.checkAuthState.bind(this)} />} />
                                <Route exact path='/register' component={Register} />
                                <Route exact path='/email/verify/:id/:hash' component={Verification} />
                                <Route path='/projects' component={Projects} />
                                <Route path='/archive' component={Archive} />
                                <Route path='/help' component={Help} />
                                <Route path='/terms' component={Terms} />
                                <Route path='/search' render={(props) => <Search {...props} onClearKeyword={this.onClearKeyword.bind(this)} q={this.state.q} />} />
                            </Switch>
                        </div>
                        <Footer />
                    </React.Fragment>)}
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
