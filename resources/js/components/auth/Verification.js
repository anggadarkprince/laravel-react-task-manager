import axios from 'axios'
import React, { Component } from 'react'
import {Link, useLocation} from "react-router-dom";
import Loading from "../statics/Loading";

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            errors: ''
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const hash = this.props.match.params.hash;
        const query = new URLSearchParams(window.location.search.substring(1));

        const params = {expires: query.get("expires"), signature: query.get("signature")};
        axios.get(`/api/email/verify/${id}/${hash}`, {params})
            .then(response => {
                this.setState({
                    isLoading: false
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errors: error.response.data.message
                })
            })
    }

    render () {
        return (
            <div className='row'>
                <div className='col-sm-6 col-md-4 mx-auto'>
                    <p className='lead'>Email Verification</p>
                    <p className='text-muted'>We verifying you account, please wait.</p>
                    {
                        this.state.isLoading ? <Loading/> : (
                            this.state.errors ? <p className='text-danger'>{this.state.errors}</p> :
                                <strong className='text-success'>
                                    Welcome aboard, Your account is verified, <Link to='/login'>click here to login</Link>.
                                </strong>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Register
