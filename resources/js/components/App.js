import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ProjectsList from './ProjectsList'
import NewProject from './NewProject'
import SingleProject from './SingleProject'

class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <Header />
                <div className='container py-4' style={{minHeight: 'calc(100vh - 175px)'}}>
                    <Switch>
                        <Route exact path='/' component={ProjectsList} />
                        <Route path='/projects' component={ProjectsList} />
                    </Switch>
                </div>
                <Footer />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
