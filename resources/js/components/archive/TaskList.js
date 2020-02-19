import axios from 'axios'
import React, { Component } from 'react'
import Loading from "../statics/Loading";

class TaskList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            project: {name: 'Loading...', description: 'Project description...'},
            tasks: [],
            title: '',
        };
    }

    componentDidMount () {
        const projectId = this.props.match.params.id;

        axios.get(`/api/archive/${projectId}`).then(response => {
            this.setState({
                isLoading: false,
                project: response.data,
                tasks: response.data.tasks
            })
        })
    }

    render () {
        const { project, tasks } = this.state;

        return (
            <div className='card shadow border-0'>
                <div className='card-header border-bottom-0 font-weight-bold bg-danger text-white d-flex justify-content-between align-items-center'>
                    <div>
                        <a href='#' onClick={e => {e.preventDefault(); this.props.history.goBack()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                                <path style={{fill: 'white'}} transform="scale(-1, 1) translate(-24, 0)" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                            </svg>
                        </a>
                        <span>{project.name}</span>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <p className='mb-0 text-muted'>{project.description}</p>
                        </div>
                        {
                            this.state.isLoading ? <Loading/> : null
                        }
                    </div>
                </div>

                <ul className='list-group list-group-flush border-top'>
                    {tasks.map(task => (
                        <li className='list-group-item d-flex justify-content-between align-items-center' key={task.id}>
                            <div>
                                <i className='mdi mdi-chevron-right mr-1'/> {task.title}
                            </div>
                            <span className={`badge badge-${task.is_completed ? 'success' : 'danger'} badge-pill`} style={{minWidth: 40}}>
                                {task.is_completed ? 'YES' : 'NO'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default TaskList
