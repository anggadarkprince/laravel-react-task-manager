import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from "axios";
import Header from './Header';
import Footer from './Footer';
import Help from './statics/Help';
import Terms from './statics/Terms';
import Loading from "./statics/Loading";
import Error404 from "./statics/Error404";
import Projects from './projects/Projects';
import Dashboard from "./home/Dashboard";
import Archive from "./archive/Archive";
import Search from "./search/Search";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Verification from "./auth/Verification";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Account from "./account/Account";
import Setting from "./setting/Setting";

class App extends Component {

    constructor (props) {
        super(props);
        let params = new URLSearchParams(window.location.search.substring(1));
        this.state = {
            pageReady: false,
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
        const guest = ['/login', '/register', '/forgot-password', '/password/reset', '/email/verify'];

        const apiToken = localStorage.getItem('api_token');

        if(apiToken) {
            let apiTokenData = JSON.parse(apiToken);

            // token expired
            let isExpired = false;
            if (new Date() > new Date(apiTokenData.token_expired_at)) {
                if (!apiTokenData.remember) {
                    this.setAuthState(false);
                    isExpired = true;
                } else {
                    let expiredDate = new Date();
                    (new Date()).setMinutes(expiredDate.getMinutes() + 60);
                    apiTokenData.token_expired_at = expiredDate;
                }
            } else {
                let expiredDate = new Date();
                expiredDate.setMinutes(expiredDate.getMinutes() + 60);
                apiTokenData.token_expired_at = expiredDate;
            }

            if(!isExpired) {
                axios.interceptors.request.use(function (config) {
                    config.headers.Authorization = 'Bearer ' + apiTokenData.token;
                    return config;
                });
            }

            // refresh token when expired
            /*
            if (new Date() > new Date(apiTokenData.token_expired_at)) {
                console.log('expired');
                axios.post('/api/token/refresh/' + apiTokenData.user_id).then(response => {
                    if (response.data.id) {
                        let expiredDate = new Date();
                        expiredDate.setMinutes(expiredDate.getMinutes() + 10);
                        const newToken = {
                            token_expired_at: expiredDate,
                            token: response.data.api_token,
                            user_id: response.data.id,
                        };
                        localStorage.setItem('api_token', JSON.stringify(newToken));
                        apiTokenData = newToken;
                    }
                })
            }*/

            axios.get('/api/user').then(response => {
                if (response.data.id) {
                    const resultPath = guest.filter((path) => {
                        return window.location.pathname.startsWith(path);
                    });
                    if(resultPath.length) {
                        window.location = '/';
                    } else {
                        this.setAuthState(true);
                        this.setState({pageReady: true});
                        localStorage.setItem('api_token', JSON.stringify(apiTokenData));
                    }
                } else {
                    this.setAuthState(false);
                    window.location = '/';
                }
            }).catch(error => {
                this.setAuthState(false);
                window.location = '/';
            });
        } else {
            const resultPath = guest.filter((path) => {
                return window.location.pathname.startsWith(path);
            });
            if(!resultPath.length) {
                window.location = '/login';
            } else {
                this.setState({ pageReady: true });
            }
        }
    }

    setAuthState(state) {
        this.setState({isLoggedIn: state});
        if(!state) {
            localStorage.removeItem('api_token');
        }
    }

    render () {
        return (
            <BrowserRouter>
                {this.state.pageReady ? (
                    <React.Fragment>
                        {this.state.isLoggedIn ? <Header setAuthState={this.setAuthState.bind(this)} onUpdateKeyword={this.onUpdateKeyword.bind(this)} q={this.state.q} /> : null}
                        <div className='wrapper'>
                            <div className='container py-4' style={{minHeight: 'calc(100vh - 175px)'}}>
                                <Switch>
                                    <Route exact path='/' component={Dashboard} />
                                    <Route exact path='/login' render={(props) => <Login {...props} checkAuthState={this.checkAuthState.bind(this)} />} />
                                    <Route exact path='/forgot-password' component={ForgotPassword} />
                                    <Route exact path='/password/reset/:token' component={ResetPassword} />
                                    <Route exact path='/register' component={Register} />
                                    <Route exact path='/email/verify/:id/:hash' component={Verification} />
                                    <Route path='/projects' component={Projects} />
                                    <Route path='/archive' component={Archive} />
                                    <Route path='/account' component={Account} />
                                    <Route path='/setting' component={Setting} />
                                    <Route path='/help' component={Help} />
                                    <Route path='/terms' component={Terms} />
                                    <Route path='/search' render={(props) => <Search {...props} onClearKeyword={this.onClearKeyword.bind(this)} q={this.state.q} />} />
                                    <Route component={Error404} />
                                </Switch>
                            </div>
                        </div>
                        <Footer />
                    </React.Fragment>) : <div className='text-center p-5'><Loading/></div>}
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
