// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from '../modules/api'
// import { 
//     getArtworkImages,
//     getArtworkThumbnailImage,
//     getArtworkRepresentImage
// } from '../modules/storage'
import { User } from './user'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Exhibition : class for exhibition
// Specification is available on official documentation
// Usage - const artwork = await new Exhibition(<id>).init()
export class Exhibition {
    id
    page_id
    name
    information

    owner
    category_list
    artwork_list

    constructor (page_id) {
        this.page_id = page_id
    }

    init = async function () {
        const { status, data } = await sendRequest('get', '/exhibition', {
            target_id : this.page_id
        })
        if (status < 400) {
            const exhibition_data = data[0][0]
            console.log(exhibition_data)

            return this
        }
        else {
            return null
        }
    }

    getThumbnailImage = async function () {
        return await getArtworkThumbnailImage(this.page_id)
    }

    getRepresentImage = async function () {
        return await getArtworkRepresentImage(this.page_id)
    }

    getID () {
        return this.id
    }

    getPageID () {
        return this.page_id
    }

    getName () {
        return this.name
    }

    getInformation () {
        return this.information
    }

    getOwner () {
        return this.owner
    }

    getCategoryList () {
        return this.category_list
    }

    getArtworkList () {
        return this.artwork_list
    }

}