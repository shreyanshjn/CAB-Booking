import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Test from './components/test/Test'
import Home from './components/home/Home'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Rider from './components/rider/Index'

export default class App extends React.Component {
    render()
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/test" component={Test} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/register" render={props => (<Register {...props} />)} />
                    <Route exact path="/login" render={props => (<Login {...props} />)} />
                    <Route exact path="/rider" render={props => (<Rider {...props} />)} />
                </Switch>
            </BrowserRouter>
        )
    }
}
