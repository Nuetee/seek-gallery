// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from '../modules/api'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Import other classes
import { User } from './user'

// Comment : class for comment
// Specification is available on official documentation
// Usage - const comment = await new Comment(<id>).init()
export class Comment {
    id
    create_date
    user_id

    writer
    body
    like_count

    constructor (id) {
        this.id = id
    }

    init = async function () {
        const { status, data } = await sendRequest('get', '/comment', {
            target_id : this.id
        })
        if (status < 400) {
            const comment_data = data[0][0]
            this.create_date = comment_data.create_date
            this.user_id = comment_data.user_id
            this.body = comment_data.body
            this.like_count = comment_data.like_count
            this.writer = await new User(this.user_id).init()

            return this
        }
        else {
            return null
        }
    }

    getID () {
        return this.id
    }

    getCreateDate () {
        return this.create_date
    }

    getWriter () {
        return this.writer
    }

    getBody () {
        return this.body
    }

    getLikeCount () {
        return this.like_count
    }

    // - type : 'inc', 'dec'
    setLikeCount (type) {
        (type === 'dec')
            ? this.like_count--
            : this.like_count++
    } 

}