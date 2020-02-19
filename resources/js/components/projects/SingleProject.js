import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";

class SingleProject extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            project: {name: 'Loading...', description: 'Project description...'},
            tasks: [],
            title: '',
            errors: []
        };
        this.handleMarkProjectAsCompleted = this.handleMarkProjectAsCompleted.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleAddNewTask = this.handleAddNewTask.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount () {
        const projectId = this.props.match.params.id;

        axios.get(`/api/projects/${projectId}`).then(response => {
            this.setState({
                isLoading: false,
                project: response.data,
                tasks: response.data.tasks
            })
        })
    }

    handleMarkProjectAsCompleted () {
        const { history } = this.props;

        this.setState({
            isLoading: true,
            tasks: this.state.tasks.map(task => {
                task['isLoading'] = true;
                return task;
            })
        });

        axios.put(`/api/projects/${this.state.project.id}/complete`)
            .then(response => history.push('/projects'))
    }

    handleFieldChange (event) {
        this.setState({
            title: event.target.value
        })
    }

    handleAddNewTask (event) {
        event.preventDefault();

        this.setState({isLoading: true});

        const task = {
            title: this.state.title,
            project_id: this.state.project.id
        };

        axios.post('/api/tasks', task)
            .then(response => {
                // clear form input
                this.setState({
                    isLoading: false,
                    title: ''
                });
                // add new task to list of tasks
                this.setState(prevState => ({
                    tasks: prevState.tasks.concat(response.data)
                }))
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

    handleMarkTaskAsCompleted (taskId) {
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task => {
                if(task.id === taskId) {
                    task['isLoading'] = task.id === taskId;
                }
                return task;
            })
        }));

        axios.put(`/api/tasks/${taskId}`).then(response => {
            this.setState(prevState => ({
                tasks: prevState.tasks.filter(task => {
                    return task.id !== taskId
                })
            }))
        })
    }

    handleEdit() {
        this.props.history.push(`/projects/${this.state.project.id}/edit`);
    }

    handleDelete(taskId) {

    }

    render () {
        const { project, tasks } = this.state;

        return (
            <div className='card shadow border-0'>
                <div className='card-header border-bottom-0 font-weight-bold bg-primary text-white d-flex justify-content-between align-items-center'>
                    <div>
                        <a href='#' onClick={e => {e.preventDefault(); this.props.history.goBack()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                                <path style={{fill: 'white'}} transform="scale(-1, 1) translate(-24, 0)" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                            </svg>
                        </a>
                        <span>{project.name}</span>
                    </div>
                    <div>
                        <button className='btn btn-warning btn-sm' disabled={this.state.isLoading} onClick={this.handleMarkProjectAsCompleted}>
                            <i className='mdi mdi-check-all'/> Mark as completed
                        </button>
                        <button className='btn btn-success btn-sm ml-1' disabled={this.state.isLoading} onClick={this.handleEdit}>
                            <i className='mdi mdi-square-edit-outline'/>
                        </button>
                        <button className='btn btn-danger btn-sm ml-1' disabled={this.state.isLoading} onClick={this.handleDelete}>
                            <i className='mdi mdi-trash-can-outline'/>
                        </button>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <p className='mb-0'>{project.description}</p>
                            <small className='text-muted'>{project.created_at}</small>
                        </div>
                        {
                            this.state.isLoading ? (
                                <div className="spinner-border spinner-border text-primary">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : null
                        }
                    </div>
                </div>

                <div className='card-body border-top'>

                    <form onSubmit={this.handleAddNewTask}>
                        {this.renderErrorFor('general')}
                        <div className='input-group'>
                            <input type='text' name='title' className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`}
                                   placeholder='Task title' maxLength='100' readOnly={this.state.isLoading} value={this.state.title} onChange={this.handleFieldChange}/>
                            <div className='input-group-append'>
                                <button className='btn btn-primary' disabled={this.state.isLoading}>Add Task</button>
                            </div>
                            {this.renderErrorFor('title')}
                        </div>
                    </form>
                </div>

                <ul className='list-group list-group-flush border-top'>
                    {tasks.map(task => (
                        <li className='list-group-item d-flex justify-content-between align-items-center' key={task.id}>
                            <div>
                                <i className='mdi mdi-chevron-right mr-1'/> {task.title}
                            </div>
                            <button className='btn btn-outline-success btn-sm' disabled={task.isLoading} onClick={this.handleMarkTaskAsCompleted.bind(this, task.id)}>
                                Complete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default SingleProject