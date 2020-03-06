import axios from 'axios'
import React, {Component} from 'react'
import {Link} from "react-router-dom";

class ForgotPassword extends Component {
    constructor(props) {
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

    handleFieldChange(event) {
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

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }

    renderErrorFor(field, className = 'invalid-feedback') {
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

    handleRequestEmail(event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

        axios.post('api/password/email', {email: this.state.email})
            .then(response => {
                this.setState({
                    isLoading: false,
                    errors: {
                        general: response.data.email,
                        success: response.data.status,
                    }
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors || {general: response.data.email || response.data.status}
                })
            });
    }

    render() {
        return (
            <div className='row'>
                <div className='col-sm-6 col-md-4 mx-auto'>
                    <h3 className='mb-0'>Reset Password</h3>
                    <p className='text-muted'>
                        Enter your email address that you used to register. We'll send you an email with your username
                        and a link to reset your password.
                    </p>
                    <form method='post' onSubmit={this.handleRequestEmail.bind(this)}>
                        {this.renderErrorFor('general')}
                        {this.renderErrorFor('success')}
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input id='email' type='email'
                                   className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`}
                                   name='email' placeholder={'Registered email address'} required maxLength='50'
                                   value={this.state.email} onChange={this.handleFieldChange}/>
                            {this.renderErrorFor('email')}
                        </div>
                        <button className='btn btn-block btn-primary mb-3' disabled={this.state.isLoading}>
                            Request Reset Password
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

export default ForgotPassword
