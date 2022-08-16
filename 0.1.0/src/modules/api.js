// Deploying axios module, Setting base url for production mode
import axios from 'axios'
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// REST API : GET, POST, PUT, DELETE
export async function sendRequest (method, url, body) {
    try {
        const result = await axios({
            method : method,
            url : '/server-api' + url,
            params : (method === 'get' || method === 'delete') ? body : null,
            data : (method === 'post' || method === 'put') ? body : null,
            validateStatus : function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        return { status: result.status, data: result.data }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } 
        else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request)
        } 
        else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
        }
        console.log(error.config)
        return { status: 500, data: error.toJSON() }
    }
}

