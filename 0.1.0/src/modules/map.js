// Deploying modules
import axios from 'axios'
import { sendRequest } from '../modules/api'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Area string rules
// 한남: 'hannam'
// 이태원: 'itaewon'
// 성수: 'seongsu'
// 북촌: 'bukcheon'
// 논현: 'nonhyeon'
// 연남: 'yeonnam'
// 을지로: 'uljiro'
// 문래: 'munrae'
export async function getExhibitionsOnArea (area, offset, limit) {
    const { status, data } = await sendRequest('post', '/exhibition/area', {
        area : area,
        offset : offset,
        limit : limit
    })
    if (status < 400) {
        return data[0].map(x => x.page_id)
    }
    else {
        return []
    }
}