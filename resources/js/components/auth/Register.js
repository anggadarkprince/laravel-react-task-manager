import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            agree: 0,
            errors: []
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleFieldChange(event) {
        if (event.target.name === 'agree') {
            this.setState({
                agree: event.target.checked
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

    handleRegister (event) {
        event.preventDefault();

        this.setState({isLoading: true});

        const { history } = this.props;

        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
            agree: this.state.agree,
        };

        axios.post('/api/register', user)
            .then(response => {
                // redirect to the homepage
                history.push('/login')
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors
                })
            })
    }

    render () {
        return (
            <div className='row'>
                <div className='col-sm-6 col-md-4 mx-auto'>
                    <div className='d-flex align-items-center mb-3'>
                        <h1 className='display-4 mb-0 mr-2 text-primary'><i className='mdi mdi-ballot-outline' /></h1>
                        <div>
                            <h3 className='mb-0 text-primary'>Register account</h3>
                            <p className='mb-0 text-muted'>Task Manager</p>
                        </div>
                    </div>
                    <form method='post' onSubmit={this.handleRegister}>
                        {this.renderErrorFor('general')}
                        <div className='form-group'>
                            <label htmlFor='name'>Name</label>
                            <input id='name' type='text' className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`}
                                name='name' placeholder={'Your full name'} required maxLength='50'
                                value={this.state.name} onChange={this.handleFieldChange} />
                            {this.renderErrorFor('name')}
                        </div>
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
                        <div className='form-group'>
                            <label htmlFor='password_confirmation'>Confirm Password</label>
                            <input id='password_confirmation' type='password' className={`form-control ${this.hasErrorFor('password_confirmation') ? 'is-invalid' : ''}`}
                                name='password_confirmation' placeholder={'Confirm the password'} required maxLength='50'
                                value={this.state.password_confirm} onChange={this.handleFieldChange} />
                            {this.renderErrorFor('password_confirm')}
                        </div>
                        <div className="form-group auth-control">
                            <div className={`custom-control custom-checkbox ${this.hasErrorFor('agree') ? 'is-invalid' : ''}`}>
                                <input type="checkbox" className="custom-control-input" id="agree" name="agree" value="1" onChange={this.handleFieldChange} />
                                <label className="custom-control-label" htmlFor="agree">I agree to the terms and condition.</label>
                            </div>
                            {this.renderErrorFor('agree')}
                        </div>
                        <button className='btn btn-block btn-primary mb-3' disabled={this.state.isLoading}>
                            Register
                        </button>
                    </form>
                    <div className="text-center auth-control">
                        <span>Already have and account? </span>
                        <Link to="/login">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register
