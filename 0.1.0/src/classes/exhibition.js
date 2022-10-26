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
    link
    information
    start_date
    end_date
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
            this.start_date = exhibition_data.start_date
            this.end_date = exhibition_data.end_date
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
            this.link = page_data.link
            this.archive_count = page_data.archive_count

            this.is_video = page_data.is_video
            this.owner = await new User(page_data.owner_id).init()

            const { status: category_status, data: category_data } = await sendRequest('get', '/exhibition/category', {
                target_id : this.page_id
            })
            const category_list = category_data[0]

            if (category_status < 400) {
                let current_category
                for (let i = 0 ; i < category_list.length; i++) {
                    const new_page_id = category_list[i].page_id
                    const new_category = category_list[i].category

                    const artwork = await new Artwork(new_page_id).init()
                    this.artwork_list.push(artwork)

                    if (i > 0 && new_category === current_category) {
                        this.category_list.push(null)
                    }
                    else {
                        this.category_list.push(new_category)
                        current_category = new_category
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

    getLocation = async function () {
        const { status, data } = await sendRequest('get', '/exhibition/location', {
            target_id : this.page_id
        })
        if (status < 500) {
            return data[0][0]
        }
        else {
            return []
        }
    }

    getLinkList () {
        return this.link
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

    getArchiveCount () {
        return this.archive_count
    }

    getStartDate () {
        return this.start_date
    }

    getEndDate () {
        return this.end_date
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

    // - type : 'inc', 'dec'
    setArchiveCount (type) {
        (type === 'dec')
            ? this.archive_count--
            : this.archive_count++
    } 

}