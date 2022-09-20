// Deploying modules
import axios from 'axios'
import {
    refresh,
    auth
} from '@/modules/auth'

// Request header for REST API
const kakaoHeader = {
    'Authorization': '69050aea9f0a72a1f382775710bee118',
    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
}

// Fetch kakao token
export async function getKakaoToken (code) {
    const data = {
        grant_type: 'authorization_code',
        client_id: '1636758aa718922858e91ae64ac93d42',
        code: code
    }
    const response = await axios
        .post(process.env.VUE_APP_KAKAO_AUTH + '/oauth/token', 
            Object.keys(data)
                .map(k => encodeURIComponent(k) + 
                    '=' + encodeURIComponent(data[k]))
                .join('&')
        , { headers: kakaoHeader })
    if (response.status === 200) {
        return response.data
    } else {
        return null
    }
}

// Refresh kakao token
export async function refreshKakaoToken (token) {
    const data = {
        grant_type: 'refresh_token',
        client_id: '1636758aa718922858e91ae64ac93d42',
        refresh_token: token
    }
    const response = await axios
        .post(process.env.VUE_APP_KAKAO_AUTH + '/oauth/token', 
            Object.keys(data)
                .map(k => encodeURIComponent(k) + 
                    '=' + encodeURIComponent(data[k]))
                .join('&')
        , { headers: kakaoHeader })
    if (response.status === 200) {
        return response.data
    } else {
        return null
    }
}

// Fetch user data
export async function getUserData (token) {
    Kakao.Auth.setAccessToken(token)
    return new Promise (function (resolve) {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function (res) {
                resolve({
                    id: res.id,
                    nickname: res.properties.nickname,
                    profile_image: res.properties.profile_image,
                    thumbnail_image: res.properties.thumbnail_image
                })
            },
            fail: function (err) {
                console.log(err.code + ": " + err.msg)
                resolve(null)
            }
        })
    })
}

// Auth by token
export async function authByToken (access_token, refresh_token) {
    let get_result = await getUserData(access_token)
    let update_access_token = access_token
    let update_refresh_token = refresh_token
    let expire_time = 251840000
    
    if (!get_result) {
        const refresh_result = await refreshKakaoToken(refresh_token)
        if (!refresh_result) {
            return null
        }
        else {
            update_access_token = refresh_result.access_token
            get_result = await getUserData(update_access_token)
            if (refresh_result.refresh_token) {
                update_refresh_token = refresh_result.refresh_token
                expire_time = refresh_result.refresh_token_expires_in
            }
        }
    }

    const user_id = await auth('kakao', get_result.id)
    if (!user_id) {
        return null
    }
    get_result.user_id = user_id
    get_result.access_token = update_access_token
    get_result.refresh_token = update_refresh_token
    get_result.expire_time = expire_time

    return get_result
}
