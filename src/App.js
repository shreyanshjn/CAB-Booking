import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Test from './components/test/Test'
import Home from './components/home/Home'

export default class App extends React.Component {
    render()
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/test" component={Test} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        )
    }
}
