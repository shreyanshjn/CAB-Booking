import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Test from './components/test/Test'
import Home from './components/home/Home'
import Register from './components/register/Register'
import Login from './components/login/Login'

export default class App extends React.Component {
    render()
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/test" component={Test} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                </Switch>
            </BrowserRouter>
        )
    }
}
