import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Projects from './projects/Projects';
import Dashboard from "./home/Dashboard";
import Help from './statics/Help';
import Terms from './statics/Terms';

class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <Header />
                <div className='container py-4' style={{minHeight: 'calc(100vh - 175px)'}}>
                    <Switch>
                        <Route exact path='/' component={Dashboard} />
                        <Route path='/projects' component={Projects} />
                        <Route path='/help' component={Help} />
                        <Route path='/terms' component={Terms} />
                    </Switch>
                </div>
                <Footer />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
