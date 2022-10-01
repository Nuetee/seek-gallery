// Deploying modules
import axios from 'axios'
import { sendRequest } from '../modules/api'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

export async function getRandomArtworks (seed, offset, limit) {
    const { status, data } = await sendRequest('get', '/user/random/artwork', {
        seed : seed,
        offset : offset,
        limit : limit
    })
    if (status < 500) {
        return data[0].map(x => x.page_id)
    }
    else {
        return []
    }
}