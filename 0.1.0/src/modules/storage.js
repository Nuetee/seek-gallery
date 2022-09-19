// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from './api'
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Constants for AWS S3 upload
const BUCKET_NAME = 'seek-gallery-storage'

// Amazon Cognito 인증 공급자를 초기화합니다
AWS.config.region = 'ap-northeast-2' 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:608e1984-aed3-4fae-8c80-81e030cd5856',
})

// Amazon S3 설정을 초기화합니다
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: BUCKET_NAME
    }
})

// Get signed urls for artwork's images
// - target_id : artwork's page_id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getArtworkImages (target_id) {
    const url = 'artwork/' + target_id + '/'
    return new Promise(function (resolve) {
        s3.listObjects({
            Prefix: url
        }, function (err, data) {
            if (err) {
                console.log(err)
                resolve(null)
            }
            else {
                const objects = data.Contents.reduce(function (res, obj) {
                    if (obj.Key.split('/').length === 3 && obj.Key !== url) {
                        res.push(process.env.VUE_APP_STORAGE_URL + '/' + obj.Key)
                    } 
                    return res
                }, [])
                resolve(objects)
            }
        })
    })
}

// Get signed urls for artwork's images
// - target_id : artwork's page_id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getArtworkThumbnailImage (target_id) {
    return process.env.VUE_APP_STORAGE_URL + '/artwork/' + target_id + '/thumbnail/thumbnail.jpg'
}

// Get signed url for artwork's represenative image
// - target_id : artwork's page_id
// return signed url of the image, or empty string if the respond is not given successfully
export async function getArtworkRepresentImage (target_id) {
    return process.env.VUE_APP_STORAGE_URL + '/artwork/' + target_id + '/0.jpg'
}

// Get signed url for artwork's represenative video
// - target_id : artwork's page_id
// return rtmp url of the video, or empty string if the respond is not given successfully
export async function getArtworkRepresentVideo (target_id) {
    return process.env.VUE_APP_STORAGE_URL + '/artwork/' + target_id + '/video/0.mp4'
}

// Get signed urls for exhibition's images
// - target_id : exhibition's page_id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getExhibitionImages (target_id) {
    const url = 'exhibition/' + target_id + '/'
    return new Promise(function (resolve) {
        s3.listObjects({
            Prefix: url
        }, function (err, data) {
            if (err) {
                console.log(err)
                resolve(null)
            }
            else {
                const objects = data.Contents.reduce(function (res, obj) {
                    if (obj.Key.split('/').length === 3 && obj.Key !== url) {
                        res.push(process.env.VUE_APP_STORAGE_URL + '/' + obj.Key)
                    } 
                    return res
                }, [])
                resolve(objects)
            }
        })
    })
}

// Get signed urls for exhibition's images
// - target_id : exhibition's page_id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getExhibitionThumbnailImage (target_id) {
    return process.env.VUE_APP_STORAGE_URL + '/exhibition/' + target_id + '/thumbnail/thumbnail.jpg'
}
