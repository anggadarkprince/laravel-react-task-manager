import React, {Component} from 'react';
import axios from "axios";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: '',
            email: '',
            current_password: '',
            password: '',
            password_confirmation: '',
            errors: []
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        axios.get('/api/user').then(response => {
            if (response.data.id) {
                this.setState({
                    isLoading: false,
                    name: response.data.name,
                    email: response.data.email,
                });
            } else {
                window.location = '/login';
            }
        }).catch(error => {
            window.location = '/login';
        });
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

    handleUpdate(event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

        const params = {
            email: this.state.email,
            name: this.state.name,
            current_password: this.state.current_password,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };
        axios.post('/api/account', params)
            .then(response => {
                if(response.data.id) {
                    this.setState({
                        isLoading: false,
                        current_password: '',
                        password: '',
                        password_confirmation: '',
                        errors: {
                            success: 'Account is updated',
                        }
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors || {general: error.response.data.email || error.response.data.status}
                })
            })
    }

    render() {
        return (
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <form method='post' onSubmit={this.handleUpdate.bind(this)}>
                        {this.renderErrorFor('general')}
                        {this.renderErrorFor('success')}

                        <div className='card shadow mb-4'>
                            <div className='card-header border-bottom-0 font-weight-bold'>
                                Account Basic
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" id="name" required name="name" placeholder="Your full name" maxLength='50'
                                                   value={this.state.name} onChange={this.handleFieldChange} readOnly={this.state.isLoading}/>
                                            {this.renderErrorFor('name')}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='form-group'>
                                            <label htmlFor='email'>Email</label>
                                            <input id='email' type='email' className={`form-control ${this.hasErrorFor('email') ? 'is-invalid' : ''}`}
                                                   name='email' placeholder={'Your email address'} required maxLength='50'
                                                   value={this.state.email} onChange={this.handleFieldChange} readOnly={this.state.isLoading}/>
                                            {this.renderErrorFor('email')}
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='current_password'>Current Password</label>
                                    <input id='current_password' type='password' className={`form-control ${this.hasErrorFor('current_password') ? 'is-invalid' : ''}`}
                                           name='current_password' placeholder={'Your password'} required maxLength='50'
                                           value={this.state.current_password} onChange={this.handleFieldChange} readOnly={this.state.isLoading}/>
                                    <span className='form-text text-muted'>Password required to change account information</span>
                                    {this.renderErrorFor('current_password')}
                                </div>
                            </div>
                        </div>

                        <div className='card shadow mb-4'>
                            <div className='card-header border-bottom-0 font-weight-bold'>
                                Change Password
                            </div>
                            <div className='card-body'>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='form-group'>
                                            <label htmlFor='password'>New Password</label>
                                            <input id='password' type='password' className={`form-control ${this.hasErrorFor('password') ? 'is-invalid' : ''}`}
                                                   name='password' placeholder={'Your password'} maxLength='50'
                                                   value={this.state.password} onChange={this.handleFieldChange} readOnly={this.state.isLoading}/>
                                            {this.renderErrorFor('password')}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='form-group'>
                                            <label htmlFor='password_confirmation'>Confirm Password</label>
                                            <input id='password_confirmation' type='password' className={`form-control ${this.hasErrorFor('password_confirmation') ? 'is-invalid' : ''}`}
                                                   name='password_confirmation' placeholder={'Confirm the password'} maxLength='50'
                                                   value={this.state.password_confirmation} onChange={this.handleFieldChange} readOnly={this.state.isLoading}/>
                                            {this.renderErrorFor('password_confirmation')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='card-footer'>
                                <span className='text-muted'>Leave it blank if you don't intended to change old password</span>
                            </div>
                        </div>
                        <button className='btn btn-block btn-primary' disabled={this.state.isLoading}>
                            Update Account
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Account;
