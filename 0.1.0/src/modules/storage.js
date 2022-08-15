// Deploying axios module, Setting base url for production mode
import axios from 'axios'
import { sendRequest } from './api'
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// Constants for AWS S3 upload
const BUCKET_NAME = 'seek-customer-storage'

// Amazon Cognito 인증 공급자를 초기화합니다
AWS.config.region = 'ap-northeast-2' 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:340b6f96-55ca-4cb5-a355-75cf434f0655',
})

// Amazon S3 설정을 초기화합니다
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: BUCKET_NAME
    }
})

// Send request for source's signed url
// - type : 'image', 'video', 'file'
// - target : 'user', 'artist', 'artwork', 'advertisement'
// - sub-target : 'profile', 'background', 'represent', 'all' or empty string
// return the signed url (or an array of urls), or empty string (or []) if the respond is not given successfully
async function sendStorageRequest (type, target, sub_target, target_id) {
    const url = '/storage/' + type + '/' + target + '/' + sub_target
    const body = {
        target_id: target_id,
    }
    const { status, data } = await sendRequest('get', url, body)
    return new Promise(function (resolve) {
        if (status < 500) {
            resolve(data)
        }
        else {
            (sub_target === 'all') ? resolve([]) : resolve("");
        }
    })
}

// Send request for uploading files
// - target : 'user', 'artist', 'artwork', 'advertisement'
// - file_names : an array of file names
// - file_lists : an array of file bodies
// return true, or false if the upload failed
async function sendStorageUpload (target, target_id, file_names, file_lists) {
    if (file_names.length !== file_lists.length) {
        return false
    }
    const file_urls = file_names.map(file_name => target + '/' + target_id + '/' + file_name)
    return new Promise(function (resolve) {
        for (let i = 0 ; i < file_names.length ; i++) {
            s3.upload({
                Key: file_urls[i],
                Body: file_lists[i],
                ACL: 'public-read'
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    resolve(false)
                } 
                else {
                    if (i === file_names.length - 1) {
                        resolve(true)
                    }
                }
            })
        }
    })
}

// Send request for deleting file
// - target : 'user', 'artist', 'artwork', 'advertisement'
// - file_names : an array of file names
// return true, or false if the upload failed
async function sendStorageDelete (target, target_id, file_names) {
    const file_urls = file_names.map(file_name => target + '/' + target_id + '/' + file_name)
    return new Promise(function (resolve) {
        for (let i = 0 ; i < file_names.length ; i++) {
            s3.deleteObject({
                Key: file_urls[i],
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    resolve(false)
                } 
                else {
                    if (i === file_names.length - 1) {
                        resolve(true)
                    }
                }
            })
        }
    })
}

// Send request for copying file
// - target : 'user', 'artist', 'artwork', 'advertisement'
// - file_names : an array of file names
// - src_index : array of old indices of target file
// - dst_index : array of new indices of target file
// return true, or false if the copy failed
async function sendStorageCopy (target, target_id, src_indices, dst_indices) {
    if (src_indices.length !== dst_indices.length) {
        return false
    }
    const src_urls = src_indices.map(i => target + '/' + target_id + '/' + String(i) + '.jpg')
    const dst_urls = dst_indices.map(j => target + '/' + target_id + '/' + String(j) + '.jpg')
    const original_urls = src_indices.map(k => target + '/' + target_id + '/original/' + String(k) + '.jpg')
    
    return new Promise(function (resolve) {
        for (let j = 0 ; j < src_indices.length ; j++) {
            s3.copyObject({
                CopySource: BUCKET_NAME + '/' + src_urls[j],
                Key: original_urls[j]
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    resolve(false)
                }
                else {
                    if (j === src_indices.length - 1) {
                        for (let i = 0 ; i < src_indices.length ; i++) {
                            s3.copyObject({
                                CopySource: BUCKET_NAME + '/' + original_urls[i],
                                Key: dst_urls[i],
                            }, async function (err, data) {
                                if (err) {
                                    console.log(err)
                                    resolve(false)
                                } 
                                else {
                                    if (i === src_indices.length - 1) {
                                        const delete_result = await sendStorageDeleteOriginal(target, target_id)
                                        resolve(delete_result)
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    })
}

// Send request for creating new directory
// - target : 'user', 'artist', 'artwork', 'advertisement'
// return true, or false if the creation failed
async function sendStoragePutDirectory (target, target_id) {
    const url = target + '/' + target_id + '/'
    return new Promise(function (resolve) {
        s3.headObject({
            Key: url
        }, function (err, data) {
            if (!err || err.code !== 'NotFound') {
                console.log(err)
                resolve(false)
            }
            else {
                s3.putObject({
                    Key: url
                }, function (err, data) {
                    if (err) {
                        console.log(err)
                        resolve(false)
                    }
                    else {
                        resolve(true)
                    }
                })
            }
        })
    })
}

// Send request for deleting directory
// - target : 'user', 'artist', 'artwork', 'advertisement'
// return true, or false if the deletion failed
async function sendStorageDeleteDirectory (target, target_id) {
    const url = target + '/' + target_id + '/'
    return new Promise(function (resolve) {
        s3.listObjects({
            Prefix: url
        }, function (err, data) {
            if (err) {
                console.log(err)
                resolve(false)
            }
            else {
                const objects = data.Contents.map(function (object) {
                    return { Key: object.Key }
                })
                s3.deleteObjects({
                    Delete: {
                        Objects: objects,
                        Quiet: true
                    }
                }, function (err, data) {
                    if (err) {
                        console.log(err)
                        resolve(false)
                    }
                    else {
                        resolve(true)
                    }
                })
            }
        })
    })
}

// Send request for deleting original directory
// - target : 'user', 'artist', 'artwork', 'advertisement'
// return true, or false if the deletion failed
async function sendStorageDeleteOriginal (target, target_id) {
    const url = target + '/' + target_id + '/original/'
    return new Promise(function (resolve) {
        s3.listObjects({
            Prefix: url
        }, function (err, data) {
            if (err) {
                console.log(err)
                resolve(false)
            }
            else {
                const objects = data.Contents.map(function (object) {
                    return { Key: object.Key }
                })
                s3.deleteObjects({
                    Delete: {
                        Objects: objects,
                        Quiet: true
                    }
                }, function (err, data) {
                    if (err) {
                        console.log(err)
                        resolve(false)
                    }
                    else {
                        resolve(true)
                    }
                })
            }
        })
    })
}

// Get signed urls for artwork's images
// - target_id : artwork's id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getArtworkImages (target_id) {
    return await sendStorageRequest('image', 'artwork', 'all', target_id)
}

// Get signed urls for artwork's images
// - target_id : artwork's id
// return an array of signed urls, or [] if the respond is not given successfully
export async function getArtworkThumbnailImage (target_id) {
    return await sendStorageRequest('image', 'artwork', 'thumbnail', target_id)
}

// Get signed url for artwork's represenative image
// - target_id : artwork's id
// return signed url of the image, or empty string if the respond is not given successfully
export async function getArtworkRepresentImage (target_id) {
    return await sendStorageRequest('image', 'artwork', 'represent', target_id)
}

// Upload artwork's all images
// - target_id : artwork's id
// return the result of upload
export async function putArtworkImages (target_id, files) {
    if (!files) {
        return false
    }
    const name_array = Array.from(
            Array(files.length).keys()
        ).map(x => String(x) + '.jpg')
    return await sendStorageUpload('artwork', target_id, name_array, files)
}

// Upload (or overwrite) artwork's images for given indices
// - target_id : artwork's id
// return the result of upload
async function modifyArtworkImages (target_id, indices, files) {
    const name_array = indices.map(x => String(x) + '.jpg')
    return await sendStorageUpload('artwork', target_id, name_array, files)
}

// Update artwork's images
// - original_length : length of original image list
// - mapping_array : list of mapped index for new image list
// ex. [0, 1, 2, 3] -> [1, null, 3, null, null]
// - target_id : artwork's id
// return the result of upload
export async function updateArtworkImages (target_id, original_length, mapping_array, files) {
    if (!files) {
        return false
    }
    const src_indices = []
    const dst_indices = []
    const new_indices = []
    const new_length = mapping_array.length

    for (let i = 0 ; i < mapping_array.length ; i++) {
        const index = mapping_array[i]
        if (index !== null) {
            if (index < original_length) {
                src_indices.push(index)
                dst_indices.push(i)
            }
            else {
                return false
            }
        }
        else {
            new_indices.push(i)
        }
    }

    let copy_result = true 
    if (src_indices.length > 0) {
        copy_result = await sendStorageCopy('artwork', target_id, src_indices, dst_indices)
    }
    if (copy_result) {
        let modify_result = true
        if (files.length > 0) {
            modify_result = await modifyArtworkImages(target_id, new_indices, files)
        }
        if (modify_result) {
            if (new_length < original_length) {
                for (let j = original_length - 1 ; j > new_length - 1 ; j--) {
                    const delete_result = await sendStorageDelete('artwork', target_id, [String(j) + '.jpg'])
                    if (!delete_result) {
                        return false
                    }
                }
            }
            return true
        }
    }
    return false
}

// Upload artwork's thumbnail (representative) image
// - target_id : artwork's id
// return the result of upload
export async function putArtworkThumbnailImage (target_id, file) {
    if (!file) {
        return false
    }
    return await sendStorageUpload('artwork', target_id, ['thumbnail/thumbnail.jpg'], [file])
}

// Delete artwork's thumbnail (representative) image
// - target_id : artwork's id
// return the result of upload
export async function deleteArtworkThumbnailImage (target_id) {
    return await sendStorageDelete('artwork', target_id, ['thumbnail/thumbnail.jpg'])
}

// Create artwork's directory
// - target_id : artwork's id
// return the result of upload
export async function putArtworkDirectory (target_id) {
    return await sendStoragePutDirectory('artwork', target_id)
}

// Delete artwork's directory
// - target_id : artwork's id
// return the result of upload
export async function deleteArtworkDirectory (target_id) {
    return await sendStorageDeleteDirectory('artwork', target_id)
}