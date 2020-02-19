import axios from 'axios'
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Loading from "../statics/Loading";

class ProjectsList extends Component {
    constructor () {
        super();
        this.state = {
            isLoading: true,
            projects: []
        }
    }

    componentDidMount () {
        axios.get('/api/projects').then(response => {
            this.setState({
                isLoading: false,
                projects: response.data
            })
        })
    }

    render () {
        const { projects, isLoading } = this.state;
        return (
            <div className='card shadow border-0'>
                <div className='card-header border-bottom-0 font-weight-bold bg-primary text-white'>ALL PROJECTS</div>
                <div className='card-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Link className='btn btn-outline-primary btn-sm' to='/projects/create'>
                            Create new project
                        </Link>
                        {
                            isLoading ? <Loading/> : null
                        }
                    </div>
                </div>
                <ul className='list-group list-group-flush border-top'>
                    {projects.map(project => (
                        <Link className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                              to={`/projects/${project.id}`} key={project.id}>
                            <div>
                                <h6 className='mb-0 font-weight-bold'>{project.name}</h6>
                                <small className='mb-0 text-muted'>{project.description}</small>
                            </div>
                            <span className='badge badge-primary badge-pill' style={{minWidth: 40}}>
                                {project.tasks_count}
                            </span>
                        </Link>
                    ))}
                </ul>
            </div>
        )
    }
}

export default ProjectsList
