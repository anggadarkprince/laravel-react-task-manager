import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Projects from './projects/Projects';
import Dashboard from "./home/Dashboard";
import Help from './statics/Help';
import Terms from './statics/Terms';
import Archive from "./archive/Archive";
import Search from "./search/Search";

class App extends Component {

    constructor (props) {
        super(props);
        let params = new URLSearchParams(window.location.search.substring(1));
        this.state = {
            q: params.get("q") || '',
        };
    }

    onUpdateKeyword(q) {
        this.setState({q: q});
    }

    onClearKeyword() {
        this.setState({q: ''});
    }

    render () {
        return (
            <BrowserRouter>
                <Header onUpdateKeyword={this.onUpdateKeyword.bind(this)} q={this.state.q} />
                <div className='container py-4' style={{minHeight: 'calc(100vh - 175px)'}}>
                    <Switch>
                        <Route exact path='/' component={Dashboard} />
                        <Route path='/projects' component={Projects} />
                        <Route path='/archive' component={Archive} />
                        <Route path='/help' component={Help} />
                        <Route path='/terms' component={Terms} />
                        <Route path='/search' render={(props) => <Search {...props} onClearKeyword={this.onClearKeyword.bind(this)} q={this.state.q} />} />
                    </Switch>
                </div>
                <Footer />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
