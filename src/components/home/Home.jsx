import React from 'react'
import { Link } from 'react-router-dom'

export default class App extends React.Component {
    render()
    {
        return (
            <div>
                Home Page
                <Link to="/register">
                    <button>Register</button>
                </Link>
                <Link to="/register">
                    <button>Login</button>
                </Link>
            </div>
        )
    }
}
