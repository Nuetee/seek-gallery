// Deploying modules
import { sendRequest } from './api'
import { User } from '@/classes/user'
import store from '@/store'

// Accessing to browser cookies via vue3-cookies
import { useCookies } from 'vue3-cookies'
const cookies = useCookies().cookies

// Register OAuth2's information
export async function login (provider, access_token, refresh_token, expireTime) {
    const { status, data } = await sendRequest('post', '/auth/login', {
        provider: provider,
        access_token: access_token
    })
    if (status < 400) {
        saveCookie(provider, {
            access_token: access_token,
            refresh_token: refresh_token,
        }, expireTime)
        return true
    }
    else {
        return false
    }
}

// Fetch user information
export async function auth (provider, provider_id) {
    const { status, data } = await sendRequest('post', '/auth', {
        provider: provider,
        provider_id: provider_id,
    })
    if (status < 400) {
        return data[0][0].user_id
    }
    else {
        return null
    }
}

// Check that given user is already registered
export async function check (provider, id) {
    const { status, data } = await sendRequest('post', '/auth/check', {
        provider: provider,
        provider_id: id
    })
    if (status < 400) {
        return data[0][0].user_id
    }
    else {
        return null
    }
}

// Refresh OAuth2's information
export async function refresh (provider, access_token, refresh_token, expireTime) {
    saveCookie(provider, {
        access_token: access_token,
        refresh_token: refresh_token,
    }, expireTime)
}

// Store via Vuex
export async function save (user_id, provider, access_token, profile_image, thumbnail_image) {
    const user = await new User(user_id).init()
    store.dispatch('setUser', {
        user: user,
        provider: provider,
        access_token: access_token,
        profile_image: profile_image,
        thumbnail_image: thumbnail_image
    })
}

// Register with OAuth2's information
export async function register (provider_id, nickname, provider, access_token, refresh_token, expireTime) {
    const { status, data } = await sendRequest('post', '/auth/register', {
        provider: provider,
        provider_id: provider_id,
        nickname: nickname
    })
    if (status < 400) {
        saveCookie(provider, {
            access_token: access_token,
            refresh_token: refresh_token,
        }, expireTime)
        return data.user_id
    }
    else {
        return null
    }
}

// Logout and remove cookie
export function logout (provider) {
    removeCookie(provider)
    store.dispatch('setEmpty')
} 

// Save cookie for token information
export function saveCookie (provider, json, expireTime) {
    cookies.set(provider, JSON.stringify(json), expireTime)
}

// Remove cookie after logout
export function removeCookie (provider) {
    if (cookies.isKey(provider)) {
        cookies.remove(provider)
    }
}

// Get cookie for given provider
function getCookie (provider) {
    return cookies.get(provider)
}

// Get access token for given provider
export function getAccessToken (provider) {
    const provider_cookie = getCookie(provider)
    return provider_cookie.access_token
}

// Get refresh token for given provider
export function getRefreshToken (provider) {
    const provider_cookie = getCookie(provider)
    return provider_cookie.refresh_token
}

// Return true if given provider's cookie exists
export function existCookie (provider) {
    return cookies.isKey(provider)
}

// Get authorized user
export function getAuth () {
    return store.getters.getUser
}

// Return true if authentication have been processed
export function isAuth () {
    if (store.getters.getUser) {
        return true
    }
    else {
        return false
    }
}