import axios from 'axios'
import React, { Component } from 'react'
import {Link} from "react-router-dom";
import Delete from "../modals/Delete";

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
        this.handleDelete = this.handleDelete.bind(this);
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

    handleEdit() {
        this.props.history.push(`/projects/${this.state.project.id}/edit`);
    }

    handleDelete(modal) {
        const projectId = this.props.match.params.id;
        modal.find('button').prop('disabled', true);
        axios.delete(`/api/projects/${projectId}`).then(response => {
            modal.modal("hide");
            this.props.history.push(`/projects`)
        })
    }

    handleFieldChange (event) {
        this.setState({
            title: event.target.value
        })
    }

    handleAddNewTask (event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

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
                this.setState(prevState => {
                    let indexBeforeCompleted = prevState.tasks.length;
                    for (let i = 0; i < prevState.tasks.length; i++) {
                        if(prevState.tasks[i].is_completed) {
                            indexBeforeCompleted = i;
                            break;
                        }
                    }

                    const newTasks = prevState.tasks;
                    newTasks.splice(indexBeforeCompleted, 0, response.data);

                    return {
                        tasks: newTasks
                    }
                })
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

    /**
     * Sorts an array of objects by column/property.
     * @param {Array} array - The array of objects.
     * @param {object} sortObject - The object that contains the sort order keys with directions (asc/desc). e.g. { age: 'desc', name: 'asc' }
     * @returns {Array} The sorted array.
     */
    multiSort(array, sortObject = {}) {
        const sortKeys = Object.keys(sortObject);

        // Return array if no sort object is supplied.
        if (!sortKeys.length) {
            return array;
        }

        // Change the values of the sortObject keys to -1, 0, or 1.
        for (let key in sortObject) {
            sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1 : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
        }

        const keySort = (a, b, direction) => {
            direction = direction !== null ? direction : 1;

            if (a === b) { // If the values are the same, do not switch positions.
                return 0;
            }

            // If b > a, multiply by -1 to get the reverse direction.
            return a > b ? direction : -1 * direction;
        };

        return array.sort((a, b) => {
            let sorted = 0;
            let index = 0;

            // Loop until sorted (-1 or 1) or until the sort keys have been processed.
            while (sorted === 0 && index < sortKeys.length) {
                const key = sortKeys[index];

                if (key) {
                    const direction = sortObject[key];

                    sorted = keySort(a[key], b[key], direction);
                    index++;
                }
            }

            return sorted;
        });
    }

    handleMarkTaskAsCompleted (taskId) {
        this.setTaskLoading(taskId);

        axios.put(`/api/tasks/${taskId}`).then(response => {
            this.setState(prevState => {
                let currentTasks = prevState.tasks.map(task => {
                    if(task.id === taskId) {
                        task['is_completed'] = 1;
                        task['isLoading'] = 0;
                    }
                    return task;
                });

                currentTasks = this.multiSort(currentTasks, {is_completed: 'asc', created_at: 'asc'});

                return {tasks: currentTasks};
            })
        })
    }

    handlingTaskDelete(taskId) {
        this.setTaskLoading(taskId);

        axios.delete(`/api/tasks/${taskId}`).then(response => {
            this.removeTaskFromList(taskId);
        })
    }

    setTaskLoading(taskId) {
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task => {
                if(task.id === taskId) {
                    task['isLoading'] = task.id === taskId;
                }
                return task;
            })
        }));
    }

    removeTaskFromList(taskId) {
        this.setState(prevState => ({
            tasks: prevState.tasks.filter(task => {
                return task.id !== taskId
            })
        }))
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
                        <button data-target="#modal-delete" data-toggle="modal" className='btn btn-danger btn-sm ml-1' disabled={this.state.isLoading}>
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
                            <div className={task.is_completed ? 'text-danger' : ''}>
                                <i className='mdi mdi-chevron-right mr-1'/>
                                {task.is_completed ? <del>{task.title}</del> : task.title}
                            </div>
                            <div>
                                <button className='btn btn-outline-success btn-sm' disabled={task.isLoading || task.is_completed} onClick={this.handleMarkTaskAsCompleted.bind(this, task.id)}>
                                    Complete
                                </button>
                                <button className='btn btn-outline-danger btn-sm ml-1' disabled={task.isLoading} onClick={this.handlingTaskDelete.bind(this, task.id)}>
                                    <i className='mdi mdi-trash-can-outline'/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <Delete title='Project' label={project.name} onDelete={this.handleDelete}/>
            </div>
        )
    }
}

export default SingleProject
