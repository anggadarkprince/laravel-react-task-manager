import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";

class EditProject extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            name: '',
            description: '',
            errors: []
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleUpdateProject = this.handleUpdateProject.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
    }

    componentDidMount () {
        const projectId = this.props.match.params.id;

        axios.get(`/api/projects/${projectId}`).then(response => {
            this.setState({
                isLoading: false,
                name: response.data.name,
                description: response.data.description,
            })
        })
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleUpdateProject (event) {
        event.preventDefault();

        this.setState({isLoading: true});

        const project = {
            name: this.state.name,
            description: this.state.description
        };

        const projectId = this.props.match.params.id;

        axios.put(`/api/projects/${projectId}`, project)
            .then(response => {
                this.props.history.push(`/projects/${projectId}`)
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors
                })
            })
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

    render () {
        return (
            <div className='card shadow border-0'>
                <div className='card-header border-bottom-0 font-weight-bold bg-warning text-white d-flex align-items-center'>
                    <a href='#' onClick={e => {e.preventDefault(); this.props.history.goBack()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                            <path style={{fill: 'white'}} transform="scale(-1, 1) translate(-24, 0)" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                        </svg>
                    </a>
                    <span>EDIT PROJECT</span>
                </div>
                <div className='card-body'>
                    <form onSubmit={this.handleUpdateProject}>
                        {this.renderErrorFor('general')}
                        <div className='form-group'>
                            <label htmlFor='name'>Project name</label>
                            <input disabled={this.state.isLoading} id='name' type='text' className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`}
                                   name='name' placeholder={'Input project title'}
                                   value={this.state.name} onChange={this.handleFieldChange}/>
                            {this.renderErrorFor('name')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Project description</label>
                            <textarea disabled={this.state.isLoading}
                                id='description' className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`}
                                name='description' rows='5' placeholder={'Detail about project'}
                                value={this.state.description} onChange={this.handleFieldChange}/>
                            {this.renderErrorFor('description')}
                        </div>
                        <button className='btn btn-block btn-outline-primary' disabled={this.state.isLoading}>Update Project</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default EditProject
