// Change given file's data URI to Binary large object
// - dataURI : URI of given image data
function dataURItoBlob (dataURI) {
    const bytes = dataURI.split(',')[0].indexOf('base64') >= 0
        ? window.atob(dataURI.split(',')[1])
        : decodeURI(dataURI.split(',')[1])
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const max = bytes.length
    const ia = new Uint8Array(max)
    for (let i = 0; i < max; i += 1) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ia], { type: mime })
}

// Get css string for cropped image
// - image_source : source of image (after url has been mapped)
// return css style for cropped image, empty string if error occurred
 // ratio = width/height
export async function cropImage (image_source, container_ratio) {
    const crop_process = (src, ratio) => {
        return new Promise(function (resolve) {
            const image = new Image()
            image.src = src

            image.onload = function () {
                if (image.width > ratio * image.height) {
                    resolve("height:100%;width:auto")
                }
                else {
                    resolve("width:100%;height:auto")
                }
            }

            // NO ERROR HANDLING!!
            // image.onerror = resolve("s")
        })
    }
    return crop_process(image_source, container_ratio)
}

// Get new file form of resized image
// - file : file source of image (after url has been mapped)
// return css style for cropped image, empty string if error occurred
 // ratio = width/height
export async function resizeImage (file, max_size) {
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');

    const resize = function () {
        let { width, height } = image
        if (width < height) {
            if (width > max_size.x) {
                height *= max_size.x / width;
                width = max_size.x;
            } 
        } 
        else if (height > max_size.y) {
            width *= max_size.y / height;
            height = max_size.y;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl)
    }

    return new Promise(function (resolve) {
        reader.onload = function (readerEvent) {
            image.onload = () => resolve(resize())
            image.src = readerEvent.target.result
        }
        reader.readAsDataURL(file)
    })
}