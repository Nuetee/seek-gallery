// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from '../modules/api'
import { 
    getExhibitionImages, 
    getExhibitionThumbnailImage
} from '@/modules/storage'

import { User } from './user'
import { Artwork } from './artwork'

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
    artwork_list = []
    category_list = []

    constructor (page_id) {
        this.page_id = page_id
    }

    init = async function () {
        const { status, data } = await sendRequest('get', '/exhibition', {
            target_id : this.page_id
        })
        if (status < 400) {
            const exhibition_data = data[0][0]
            this.id = exhibition_data.id
            this.name = exhibition_data.name
            this.information = exhibition_data.information

            this.owner = await new User(exhibition_data.owner_id).init()
            const { status: list_status, data: list_data } = await sendRequest(
                'post', 
                '/exhibition/artwork_list', {
                target_id : this.id
            })

            if (list_status < 400) {
                const artworks = list_data[0]

                for (let i = 0 ; i < artworks.length ; i++) {
                    const artwork_data = artworks[i]
                    const artwork = await new Artwork(artwork_data.page_id).init()
                    this.artwork_list.push(artwork)
                    this.category_list.push(artwork_data.category)
                }
                return this
            }
        }
        return null
    }

    getImages = async function () {
        return await getExhibitionImages(this.page_id)
    }

    getThumbnailImage = async function () {
        return await getExhibitionThumbnailImage(this.page_id)
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

    getOwnerName () {
        return this.owner.getName()
    }

    getCategoryList () {
        return this.category_list
    }

    getArtworkList () {
        return this.artwork_list
    }

}