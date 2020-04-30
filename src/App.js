import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import Test from './components/test/Test'
import Home from './components/home/Home'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Rider from './components/rider/Index'
import Driver from './components/driver/Index'
import AuthService from './handlers/AuthService'
import FetchApi from './utils/FetchApi'

export default class App extends React.Component {
    _isMounted = false;
    constructor()
    {
        super()
        this.state={
            isAuthenticated: false,
            userData: '',
            user: 'driver',
            error: ''
        }
        this.Auth = new AuthService()
    }
    updateAuthentication = (value, user) => {
        console.log(value,'inside')
        this.setState({
            isAuthenticated:value,
            user: user
        })
    }
    async componentDidMount()
    {   
        this._isMounted = true;
        let token = this.Auth.getToken('driver')
        if(!token)
        {
            await this.setState({
                user: 'rider'
            })
            token=this.Auth.getToken('rider')
        }
        if(token)
        {
            await FetchApi('get', `/api/${this.state.user}/userData`,null,token)
                .then(res => {
                    this.setState({
                        isAuthenticated: true,
                        userData: res.data.data
                    })
                })
                .catch(err => {
                    console.log(err.response,'fad')
                    if(err.response && err.response.data)
                    {
                        this.setState({
                            isAuthenticated: false,
                            error: err.response.data.msg
                        })
                    }
                    else
                    {
                        this.setState({
                            isAuthenticated: false,
                            error: 'Something went wrong'
                        })
                    }
                })
        }
    }
    componentWillUnmount()
    {
      this._isMounted=false
    }
    render()
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={props => (<Home {...props} userData={this.state.userData} isAuthenticated={this.state.isAuthenticated} user={this.state.user}  />)} />
                    {!this.state.isAuthenticated?
                    <React.Fragment>
                        <Route exact path="/register" render={props => (<Register {...props} updateAuthentication={this.updateAuthentication} />)} />
                        <Route exact path="/login" render={props => (<Login {...props} updateAuthentication={this.updateAuthentication} isAuthenticated={this.state.isAuthenticated} />)} />
                    </React.Fragment>:
                            this.state.user==="rider" ?<Route exact path="/rider" render={props => (<Rider {...props} userData={this.state.userData} isAuthenticated={this.state.isAuthenticated} updateAuthentication={this.updateAuthentication}/>)} />: 
                            <Route exact path="/driver" render={props => (<Driver {...props} userData={this.state.userData} isAuthenticated={this.state.isAuthenticated} updateAuthentication={this.updateAuthentication}/>)} />}
                        </Switch>
                    </BrowserRouter>
        )
    }
}
