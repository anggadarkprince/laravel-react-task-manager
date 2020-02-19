import React, { Component } from 'react';
import Pagination from '../Pagination';
import {Link} from "react-router-dom";
import Loading from "../statics/Loading";

class ArchiveList extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            archives: []
        };
    }

    onPageChanged = currentPage => {
        this.setState({isLoading: true});
        axios.get(`/api/archive?page=${currentPage}`)
            .then(response => {
                this.setState({
                    isLoading: false,
                    archives:  response.data
                });
            });
    };

    renderView() {
        return (
            <ul className={`list-group list-group-flush border-top${this.state.isLoading ? ' loading-overlay' : ''}`}>
                {this.state.archives.data.map(project => (
                    <Link className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                          to={`/archive/${project.id}`} key={project.id}>
                        <div>
                            <h6 className='mb-0 font-weight-bold'>{project.name}</h6>
                            <small className='mb-0 text-muted'>{project.description}</small>
                        </div>
                    </Link>
                ))}
            </ul>
        )
    }


    render() {
        return (
            <div>
                <div className='card shadow border-0'>
                    <div className='card-header border-bottom-0 font-weight-bold bg-danger text-white'>ARCHIVED</div>
                    {this.state.isLoading && this.state.archives.length === 0 ? <Loading className='p-3 text-center'/> : this.renderView()}
                </div>
                <div className="card-footer border-0">
                    <Pagination title='Archive' totalData={this.state.archives.total} totalPage={this.state.archives.last_page} onPageChanged={this.onPageChanged} />
                </div>
            </div>
        );
    }
}

export default ArchiveList;
