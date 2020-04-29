import React from 'react'

export default class AuthService extends React.Component {
    hasToken() {
        const token = this.getToken()
        return !!token
    }

    getToken(token_name) {
        return localStorage.getItem(token_name)
    }

    logout(token_name) {
        if (this.getToken()) {
            localStorage.removeItem(token_name)
        }
    }

    setToken(token_name, token) {
        localStorage.setItem(token_name, token)
    }
}
