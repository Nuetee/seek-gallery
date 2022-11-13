// Deploying modules
import axios from 'axios'
import { sendRequest } from '../modules/api'
import {
    doSession,
    doHistory,
    doLike,
    doArtworkArchive,
    isArtworkArchived,
    isExhibitionArchived,
    doExhibitionArchive,
    isLiked,
    isHistory,
    updateHistory
} from '../modules/event'
import store from '../store'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// User : class for user
// Specification is available on official documentation
// Usage - const user = await new User(<id>).init()
export class User {
    id
    page_id
    nickname
    sns

    constructor (id) {
        this.id = id
    }

    init = async function () {
        const { status, data } = await sendRequest('post', '/user', {
            target_id : this.id
        })
        if (status < 400) {
            const user_data = data[0][0]
            this.page_id = user_data.page_id
            this.nickname = user_data.nickname
            if (user_data.sns) {
                this.sns = user_data.sns
            }
            else {
                this.sns = ''
            }
            return this
        }
        else {
            return null
        }
    }

    getID () {
        return this.id
    }

    getPageID () {
        return this.page_id
    }

    getNickname () {
        return this.nickname
    }

    getSNS () {
        return this.sns
    }

    getThumbnail () {
        return store.getters.getThumbnail
    }

    getProfile () {
        return store.getters.getProfile
    }

    isArtworkArchived = async function (artwork) {
        return await isArtworkArchived(artwork.getID(), this.id)
    } 

    isExhibitionArchived = async function (exhibition) {
        return await isExhibitionArchived(exhibition.getID(), this.id)
    } 

    isExhibitionHistory = async function (exhibition) {
        return await isHistory(exhibition.getID(), this.id)
    } 

    isCommentLiked = async function (comment) {
        return await isLiked(comment.getID(), this.id)
    } 

    getArchiveArtworks = async function (offset, limit) {
        const { status, data } = await sendRequest('post', '/user/archive/artwork', {
            target_id : this.id,
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

    getArchiveExhibitions = async function (offset, limit) {
        const { status, data } = await sendRequest('post', '/user/archive/exhibition', {
            target_id : this.id,
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

    getHistoryExhibitions = async function (offset, limit) {
        const { status, data } = await sendRequest('post', '/user/history', {
            target_id : this.id,
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

    getOwnArtworks = async function (offset, limit) {
        const { status, data } = await sendRequest('post', '/artist/artwork', {
            target_id : this.id,
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

    getTotalExhibitions = async function (offset, limit) {
        const { status, data } = await sendRequest('post', '/artist/exhibition/total', {
            target_id : this.id,
            offset : offset,
            limit : limit
        }) 
        if (status < 500) {
            return data[0].map(function (x) {
                return {
                    page_id: x.page_id,
                    is_owner: x.is_owner 
                }
            })
        }
        else {
            return []
        }
    }
    
    putUserData = async function (target, value) {
        const { status, data } = await sendRequest('put', '/user/' + target, {
            target_id : this.id,
            data: value
        })
        if (status < 500) {
            this[target] = value
            return true
        }
        else {
            return false
        }
    }
    
    putNickname = async function (nickname) {
        const result = await this.putUserData('nickname', nickname)
        return result
    }

    putUserSession = async function () {
        return await doSession(this.id)
    }

    putExhibitionHistory = async function (exhibition) {
        return await doHistory(exhibition.getID(), this.id)
    }

    updateExhibitionHistory = async function (exhibition) {
        return await updateHistory(exhibition.getID(), this.id)
    }

    putArtworkArchive = async function (artwork) {
        const archived_check = await isArtworkArchived(artwork.getID(), this.id)
        if (!archived_check) {
            const archive_result = await doArtworkArchive(artwork.getID(), this.id)
            if (archive_result) {
                artwork.setArchiveCount('inc')
                return true
            }
        } 
        return false
    }

    putArtworkUnarchive = async function (artwork) {
        const archived_check = await isArtworkArchived(artwork.getID(), this.id)
        if (archived_check) {
            const archive_result = await doArtworkArchive(artwork.getID(), this.id, true)
            if (archive_result) {
                artwork.setArchiveCount('dec')
                return true
            }
        } 
        return false
    }

    putExhibitionArchive = async function (exhibition) {
        const archived_check = await isExhibitionArchived(exhibition.getID(), this.id)
        if (!archived_check) {
            const archive_result = await doExhibitionArchive(exhibition.getID(), this.id)
            if (archive_result) {
                exhibition.setArchiveCount('inc')
                return true
            }
        } 
        return false
    }

    putExhibitionUnarchive = async function (exhibition) {
        const archived_check = await isExhibitionArchived(exhibition.getID(), this.id)
        if (archived_check) {
            const archive_result = await doExhibitionArchive(exhibition.getID(), this.id, true)
            if (archive_result) {
                exhibition.setArchiveCount('dec')
                return true
            }
        } 
        return false
    }

    putComment = async function (artwork, body) {
        const { status, data } = await sendRequest('post', '/comment', {
            user_id : this.id,
            artwork_id : artwork.getID(),
            body : body
        })
        if (status < 500) {
            return data.comment_id
        }
        else {
            return null
        }
    }

    putCommentLike = async function (comment) {
        const liked_check = await isLiked(comment.getID(), this.id)
        if (!liked_check) {
            const like_result = await doLike(comment.getID(), this.id)
            if (like_result) {
                comment.setLikeCount('inc')
                return true
            }
        } 
        return false
    }

    putCommentUnlike = async function (comment) {
        const liked_check = await isLiked(comment.getID(), this.id)
        if (liked_check) {
            const like_result = await doLike(comment.getID(), this.id, true)
            if (like_result) {
                comment.setLikeCount('dec')
                return true
            }
        } 
        return false
    }

    deleteComment = async function (comment) {
        const { status, data } = await sendRequest('put', '/comment', {
            user_id : this.id,
            comment_id : comment.getID()
        })
        if (status < 500) {
            return data
        }
        else {
            return false
        }
    }

}