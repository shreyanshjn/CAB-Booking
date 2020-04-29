import axios from 'axios'

const FetchApi = (method, url, params, TokenValue) => {
    if (process.env.React_env === 'dev') {
        url = 'http://localhost:' + process.env.React_server_port + url
    }
    return new Promise((resolve, reject) => {
        if (TokenValue) {
            axios({
                method: method,
                url: url,
                data: params,
                headers: {
                    'Authorization': TokenValue
                },
                responseType: 'json'
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        } else {
            axios({
                method: method,
                url: url,
                data: params,
                responseType: 'json'
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        }
    })
}

export default FetchApi
