import React from 'react'
import AuthService from '../../handlers/AuthService'
import { Button } from '@material-ui/core'

export default class Logout extends React.Component {
    constructor()
    {
        super()
        this.Auth = new AuthService()
    }
    logout = () => {
        this.Auth.logout(this.props.user)
        this.props.updateAuthentication(false,this.props.user)
        this.props.history.push('/')
    }
    render()
    {
        return (
            <div>
                <Button onClick={this.logout} variant="contained">Logout</Button>
            </div>
        )
    }
}

