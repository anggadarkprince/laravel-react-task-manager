import axios from 'axios'
import React, { Component } from 'react'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import NewProject from "./NewProject";
import SingleProject from "./SingleProject";

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
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <Switch>
                        <Route  path={`${this.props.match.path}/create`} component={NewProject}/>
                        <Route path={`${this.props.match.path}/:id`} component={SingleProject} />
                        <Route path={this.props.match.path}>
                            <div className='card shadow border-0'>
                                <div className='card-header border-bottom-0 font-weight-bold bg-primary text-white'>ALL PROJECTS</div>
                                <div className='card-body'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <Link className='btn btn-outline-primary btn-sm' to='/projects/create'>
                                            Create new project
                                        </Link>
                                        {
                                            isLoading ? (
                                                <div className="spinner-border spinner-border-sm text-primary">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ) : null
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
                        </Route>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default ProjectsList
