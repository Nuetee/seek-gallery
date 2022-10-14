// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from './api'
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Send request for general events (follow, like, bookmark)
// - method : 'post', 'delete', 'get'
// - type : 'archive'
// - target : 'user', 'artist', 'artwork', 'reply', 'blog'
// return true if event request has been executed successfully
async function sendEventRequest (method, type, target, target_id, user_id) {
    const url = '/event/' + type + '/' + target
    const body = {
        target_id : target_id,
        user_id : user_id
    }
    const { status, data } = await sendRequest(method, url, body)
    if (status < 500) {
        return data
    }
    else {
        return false
    }
}

// User archive (or unarchive) artwork 
// - target_id : artwork's id
// - is_unarchive : true if the request is for unarchive
// return true if archive (or unarchive) has been done successfully, false if not
export async function doArtworkArchive (target_id, user_id, is_unarchive = false) {
    return (is_unarchive) 
        ? await sendEventRequest('put', 'archive', 'artwork', target_id, user_id) 
        : await sendEventRequest('post', 'archive', 'artwork', target_id, user_id) 
}

// User archive (or unarchive) exhibition
// - target_id : exhibition's id
// - is_unarchive : true if the request is for unarchive
// return true if archive (or unarchive) has been done successfully, false if not
export async function doExhibitionArchive (target_id, user_id, is_unarchive = false) {
    return (is_unarchive) 
        ? await sendEventRequest('put', 'archive', 'exhibition', target_id, user_id) 
        : await sendEventRequest('post', 'archive', 'exhibition', target_id, user_id) 
}

// User like (or unlike) comment 
// - target_id : comment's id
// - is_unarchive : true if the request is for unarchive
// return true if like (or unlike) has been done successfully, false if not
export async function doLike (target_id, user_id, is_unlike = false) {
    return (is_unlike) 
        ? await sendEventRequest('put', 'like', 'comment', target_id, user_id) 
        : await sendEventRequest('post', 'like', 'comment', target_id, user_id) 
}

// User visit exhibition
// - target_id : exhibition's id
// return true if logging has been done successfully, false if not
export async function doHistory (target_id, user_id) {
    return await sendEventRequest('post', 'history', 'exhibition', target_id, user_id) 
}

// User visit after registration
// return true if logging has been done successfully, false if not
export async function doSession (user_id) {
    return await sendEventRequest('post', 'session', '', '', user_id) 
}

// User re-visit artwork 
// - target_id : artwork's id
// return true if logging has been done successfully, false if not
export async function updateHistory (target_id, user_id) {
    return await sendEventRequest('put', 'history', 'exhibition', target_id, user_id) 
}

// Check if user has archived the artwork
// - target_id : artwork's id
// return true if user has archived the artwork, false if not
export async function isArtworkArchived (target_id, user_id) {
    return await sendEventRequest('post', 'user/archive', 'artwork', target_id, user_id) 
}

// Check if user has archived the exhibition
// - target_id : exhibition's id
// return true if user has archived the artwork, false if not
export async function isExhibitionArchived (target_id, user_id) {
    return await sendEventRequest('post', 'user/archive', 'exhibition', target_id, user_id) 
}

// Check if user has liked the comment
// - target_id : comment's id
// return true if user has liked the comment, false if not
export async function isLiked (target_id, user_id) {
    return await sendEventRequest('post', 'user/like', 'comment', target_id, user_id) 
}

// Check if user has seen the artwork
// - target_id : artwork's id
// return true if user has seen the artwork, false if not
export async function isHistory (target_id, user_id) {
    return await sendEventRequest('post', 'user/history', 'exhibition', target_id, user_id) 
}