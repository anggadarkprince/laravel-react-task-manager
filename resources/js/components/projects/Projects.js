import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import NewProject from "./NewProject";
import SingleProject from "./SingleProject";
import ProjectsList from "./ProjectsList";
import EditProject from "./EditProject";

class Projects extends Component {

    render () {
        return (
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <Switch>
                        <Route  path={`${this.props.match.path}/create`} component={NewProject}/>
                        <Route exact path={`${this.props.match.path}/:id`} component={SingleProject} />
                        <Route exact path={`${this.props.match.path}/:id/edit`} component={EditProject} />
                        <Route path={this.props.match.path} component={ProjectsList} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Projects
