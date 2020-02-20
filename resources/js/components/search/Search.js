import axios from 'axios'
import React, {Component} from 'react'
import Loading from "../statics/Loading";
import {Link} from "react-router-dom";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            projects: [],
            tasks: [],
        }
    }

    componentDidMount() {
        this.searchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.q && prevProps.q !== this.props.q) {
            this.searchData();
        }
    }

    componentWillUnmount() {
        this.props.onClearKeyword();
    }

    searchData() {
        if(this.props.q) {
            this.setState({isLoading: true});
            axios.get('/api/search', {params: {q: this.props.q}}).then(response => {
                this.setState({
                    isLoading: false,
                    projects: response.data.projects,
                    tasks: response.data.tasks,
                })
            })
        } else {
            this.setState({isLoading: false});
        }
    }

    searchResult() {
        return (
            <div>
                <div className='card shadow border-0 mb-3'>
                    <div className='card-header border-bottom-0 font-weight-bold bg-primary text-white'>PROJECTS</div>
                    <ul className='list-group list-group-flush border-top'>
                        {this.state.projects.length ? this.state.projects.map(project => (
                            <Link className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                                  to={`/projects/${project.id}`} key={project.id}>
                                <div>
                                    <h6 className='mb-0 font-weight-bold'>{project.name}</h6>
                                    <small className='mb-0 text-muted'>{project.description}</small>
                                </div>
                            </Link>
                        )) : <li className='list-group-item'>No project data</li>}
                    </ul>
                </div>
                <div className='card shadow border-0'>
                    <div className='card-header border-bottom-0 font-weight-bold bg-primary text-white'>TASKS</div>
                    <ul className='list-group list-group-flush border-top'>
                        {this.state.tasks.length ? this.state.tasks.map(task => (
                            <Link className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                                  to={`/projects/${task.project_id}`} key={task.id}>
                                <div>
                                    <h6 className='mb-0 font-weight-bold'>{task.title}</h6>
                                    <small className='mb-0 text-muted'>{task.project.name}</small>
                                </div>
                            </Link>
                        )) : <li className='list-group-item'>No task data</li>}
                    </ul>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <h4 className='mb-3'>Result of "{this.props.q}"</h4>
                    {this.state.isLoading ? <Loading className='my-3 text-center'/> : this.props.q ? this.searchResult() : <span>Please type a keyword</span>}
                </div>
            </div>
        )
    }
}

export default Search
