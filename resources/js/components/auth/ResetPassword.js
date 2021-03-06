import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";

class ResetPassword extends Component {
    constructor (props) {
        super(props);
        const query = new URLSearchParams(props.location.search.substring(1));
        this.state = {
            isLoading: false,
            token: props.match.params.token,
            email: query.get("email"),
            password: '',
            password_confirmation: '',
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
            if (field === 'general' || field === 'success') {
                return (
                    <div className={`alert alert-${field === 'success' ? 'success' : 'warning'} alert-dismissible`} role="alert">
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

    handleRecoverPassword(event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

        const params = {
            email: this.state.email,
            token: this.state.token,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };
        axios.post('/api/password/reset', params)
            .then(response => {
                this.setState({
                    isLoading: false,
                    errors: {
                        general: response.data.email,
                        success: response.data.status,
                    }
                });
                setTimeout(function () {
                    window.location = '/login';
                }, 1000);
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors || {general: error.response.data.email || error.response.data.status}
                })
            })
    }

    render () {
        return (
            <div className='row'>
                <div className='col-sm-6 col-md-4 mx-auto'>
                    <h3 className='mb-0'>Password Recovery</h3>
                    <p className='text-muted'>Resetting your credentials</p>
                    <form method='post' onSubmit={this.handleRecoverPassword.bind(this)}>
                        {this.renderErrorFor('general')}
                        {this.renderErrorFor('success')}
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input id='email' type='email' className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`}
                                name='email' placeholder={'Registered email address'} readOnly required maxLength='50'
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
                        <div className='form-group'>
                            <label htmlFor='password_confirmation'>Confirm Password</label>
                            <input id='password_confirmation' type='password' className={`form-control ${this.hasErrorFor('password_confirmation') ? 'is-invalid' : ''}`}
                                   name='password_confirmation' placeholder={'Confirm the password'} required maxLength='50'
                                   value={this.state.password_confirmation} onChange={this.handleFieldChange} />
                            {this.renderErrorFor('password_confirmation')}
                        </div>
                        <button className='btn btn-block btn-primary mb-3' disabled={this.state.isLoading}>
                            Reset My Password
                        </button>
                    </form>
                    <div className="text-center auth-control">
                        <span>Remember password? </span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetPassword
