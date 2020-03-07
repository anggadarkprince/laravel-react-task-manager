import React, {Component} from 'react';
import axios from "axios";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            notify_when_task_completed: false,
            notify_when_new_project_created: false,
            errors: []
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        axios.get('/api/setting').then(response => {
            this.setState({
                isLoading: false,
                notify_when_task_completed: Number(response.data.notify_when_task_completed || 1),
                notify_when_new_project_created: Number(response.data.notify_when_new_project_created || 1),
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field, className = 'invalid-feedback') {
        if (this.hasErrorFor(field)) {
            if (field === 'general' || field === 'success') {
                return (
                    <div className={`alert alert-${field === 'success' ? 'success' : 'warning'} alert-dismissible`} role="alert">
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

    handleUpdate(event) {
        event.preventDefault();

        this.setState({isLoading: true, errors: []});

        const params = {
            notify_when_task_completed: this.state.notify_when_task_completed,
            notify_when_new_project_created: this.state.notify_when_new_project_created,
        };
        axios.post('/api/setting', params)
            .then(response => {
                this.setState({
                    isLoading: false,
                    errors: {
                        success: 'Setting is updated',
                    }
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.errors || {general: error.response.data.status}
                })
            })
    }

    render() {
        return (
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <form method='post' onSubmit={this.handleUpdate.bind(this)}>
                        {this.renderErrorFor('general')}
                        {this.renderErrorFor('success')}

                        <div className='card shadow mb-4'>
                            <div className='card-header border-bottom-0 font-weight-bold'>
                                Setting Basic
                            </div>
                            <div className="card-body">
                                <div className="form-group auth-control">
                                    <div className={`custom-control custom-checkbox ${this.hasErrorFor('notify_when_task_completed') ? 'is-invalid' : ''}`}>
                                        <input type="checkbox" className="custom-control-input" id="notify_when_task_completed" name="notify_when_task_completed" value='1' checked={!!this.state.notify_when_task_completed} onChange={this.handleFieldChange} />
                                        <label className="custom-control-label" htmlFor="notify_when_task_completed">Notify me when task is completed.</label>
                                    </div>
                                    {this.renderErrorFor('notify_when_task_completed')}
                                </div>
                                <div className="form-group auth-control">
                                    <div className={`custom-control custom-checkbox ${this.hasErrorFor('notify_when_new_project_created') ? 'is-invalid' : ''}`}>
                                        <input type="checkbox" className="custom-control-input" id="notify_when_new_project_created" name="notify_when_new_project_created" value='1' checked={!!this.state.notify_when_new_project_created} onChange={this.handleFieldChange} />
                                        <label className="custom-control-label" htmlFor="notify_when_new_project_created">Notify me when project is created.</label>
                                    </div>
                                    {this.renderErrorFor('notify_when_new_project_created')}
                                </div>
                            </div>
                        </div>

                        <button className='btn btn-block btn-primary' disabled={this.state.isLoading}>
                            Update Setting
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Setting;
