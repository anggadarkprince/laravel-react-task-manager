import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import Loading from "../statics/Loading";

class Dashboard extends Component {

    constructor () {
        super();
        this.state = {
            isLoading: true,
            statistic: {}
        }
    }

    componentDidMount () {
        axios.get('/api/dashboard').then(response => {
            this.setState({
                isLoading: false,
                statistic: response.data
            })
        });
    }

    render() {
        return (
            <div>
                <h4 className='mb-3'>Dashboard</h4>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-0">Total Projects</h5>
                                <p className='card-text text-muted mb-1'>Project that currently active</p>
                                <div className="lead text-success">
                                    {this.state.isLoading ? <Loading/> : this.state.statistic.projects} items
                                </div>
                                <hr/>
                                <Link className='btn btn-sm btn-outline-success' to='/projects/create'>
                                    Create Project <i className='mdi mdi-arrow-right'/>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-0">Total Tasks</h5>
                                <p className='card-text text-muted mb-1'>All active task inside the project</p>
                                <div className="lead text-warning">
                                    {this.state.isLoading ? <Loading/> : this.state.statistic.tasks} items
                                </div>
                                <hr/>
                                <Link className='btn btn-sm btn-outline-warning' to='/projects'>
                                    Go To Project <i className='mdi mdi-arrow-right'/>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-0">Archived Tasks</h5>
                                <p className='card-text text-muted mb-1'>Old task that completed already</p>
                                <div className="lead text-danger">
                                    {this.state.isLoading ? <Loading/> : this.state.statistic.archived} items
                                </div>
                                <hr/>
                                <Link className='btn btn-sm btn-outline-danger' to='/archive'>
                                    See Archived <i className='mdi mdi-arrow-right'/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
