import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import ArchiveList from "./ArchiveList";
import TaskList from "./TaskList";

class Archive extends Component {

    render () {
        return (
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <Switch>
                        <Route path={`${this.props.match.path}/:id`} component={TaskList} />
                        <Route path={this.props.match.path} component={ArchiveList} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Archive
