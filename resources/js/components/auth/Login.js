import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            remember: false,
            errors: []
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
    }

    handleFieldChange (event) {
        if (event.target.name === 'remember') {
            this.setState({
                remember: event.target.checked
            });
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field, className = 'invalid-feedback') {
        if (this.hasErrorFor(field)) {
            if(field === 'general') {
                return (
                    <div className="alert alert-warning alert-dismissible" role="alert">
                        {this.state.errors[field]}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )
            }
            return (
                <span className={className}>
                    {this.state.errors[field][0]}
                </span>
            )
        }
    }

    handleLogin(event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

        const user = {
            email: this.state.email,
            password: this.state.password,
        };

        axios.post('/api/login', user)
            .then(response => {
                this.setState({isLoading: false});
                let expiredDate = new Date();
                expiredDate.setMinutes(expiredDate.getMinutes() + 10);
                if (this.state.remember) {
                    localStorage.setItem('api_token', JSON.stringify({
                        token_expired_at: expiredDate,
                        token: response.data.api_token,
                        user_id: response.data.id,
                    }));
                } else {
                    sessionStorage.setItem('api_token', JSON.stringify({
                        token_expired_at: expiredDate,
                        token: response.data.api_token,
                        user_id: response.data.id,
                    }));
                }
                this.props.checkAuthState(true);
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors
                })
            });
    }

    render () {
        return (
            <div className='row'>
                <div className='col-sm-6 col-md-4 mx-auto'>
                    <div className='d-flex align-items-center mb-3'>
                        <h1 className='display-4 mb-0 mr-2 text-primary'><i className='mdi mdi-ballot-outline' /></h1>
                        <div>
                            <h3 className='mb-0 text-primary'>Task Manager</h3>
                            <p className='mb-0 text-muted'>Manage your todo list is simple way</p>
                        </div>
                    </div>
                    <form method='post' onSubmit={this.handleLogin.bind(this)}>
                        {this.renderErrorFor('general')}
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input id='email' type='email' className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`}
                                name='email' placeholder={'Your email address'} required maxLength='50'
                                value={this.state.email} onChange={this.handleFieldChange} />
                            {this.renderErrorFor('email')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input id='password' type='password' className={`form-control ${this.hasErrorFor('password') ? 'is-invalid' : ''}`}
                                name='password' placeholder={'Your password'} required maxLength='50'
                                value={this.state.password} onChange={this.handleFieldChange} />
                            {this.renderErrorFor('password')}
                        </div>
                        <div className="form-group auth-control">
                            <div className="row">
                                <div className="col">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="remember" name="remember" value="1" onChange={this.handleFieldChange}/>
                                        <label className="custom-control-label" htmlFor="remember">Remember me</label>
                                    </div>
                                </div>
                                <div className="col text-right">
                                    <Link to="/forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <button className='btn btn-block btn-primary mb-3' disabled={this.state.isLoading}>
                            Login
                        </button>
                    </form>
                    <div className="text-center auth-control">
                        <span>Not a member? </span>
                        <Link to="/register">
                            Create new account
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
