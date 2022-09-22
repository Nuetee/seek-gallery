// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from '../modules/api'
import { 
    getExhibitionImages, 
    getExhibitionThumbnailImage,
    getExhibitionRepresentVideo
} from '@/modules/storage'

import { User } from './user'
import { Artwork } from './artwork'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

function isArray(json) {
    return Object.prototype.toString.call(json) === '[object Array]';
}

// Exhibition : class for exhibition
// Specification is available on official documentation
// Usage - const artwork = await new Exhibition(<id>).init()
export class Exhibition {
    id
    page_id
    name
    nickname
    information
    is_video

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
            this.nickname = exhibition_data.nickname
            
            return this
        }
        else {
            return null
        }
    }

    initializePage = async function () {
        const { status, data } = await sendRequest('get', '/exhibition/page', {
            target_id : this.page_id
        })
        if (status < 400) {
            const page_data = data[0][0]
            this.information = page_data.information
            this.is_video = page_data.is_video
            this.owner = await new User(page_data.owner_id).init()

            if (page_data.category && isArray(page_data.category)) {
                for (let i = 0 ; i < page_data.category.length; i++) {
                    const artwork = await new Artwork(page_data.category[i]).init()
                    this.artwork_list.push(artwork)
                    this.category_list.push(null)
                }
            }
            else {
                for (let obj in page_data.category) {
                    const page_array = page_data.category[obj]
                    for (let i = 0; i < page_array.length; i++) {
                        const artwork = await new Artwork(page_array[i]).init()
                        this.artwork_list.push(artwork)
                        this.category_list.push((i > 0) ? null : obj)
                    }
                }
            }
        }
    }

    getImages = async function () {
        return await getExhibitionImages(this.page_id)
    }

    getThumbnailImage = async function () {
        return await getExhibitionThumbnailImage(this.page_id)
    }

    getVideo = async function () {
        if (this.is_video !== null) {
            return await getExhibitionRepresentVideo(this.page_id)
        }
        else {
            return null
        }
    }

    getLinkList = async function () {
        const { status, data } = await sendRequest('get', '/exhibition/link', {
            target_id : this.page_id
        })
        if (status < 500) {
            return data[0].map(function (x) { 
                return {
                    id: x.id,
                    title: x.title, 
                    link: x.link
                }
            })
        }
        else {
            return []
        }
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

    getOwnerName () {
        return this.nickname
    }

    getInformation () {
        return this.information
    }

    getOwner () {
        return this.owner
    }

    isVideo () {
        return this.is_video
    }

    getCategoryList () {
        return this.category_list
    }

    getArtworkList () {
        return this.artwork_list
    }

}