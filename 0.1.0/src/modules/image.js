// Get css string for cropped image
// - image_source : source of image (after url has been mapped)
// return css style for cropped image, empty string if error occurred
// ratio = width/height
// if fill_container == true, return style that makes image fill container, else, return style that makes the entire image visible
export async function cropImage (image_source, container_ratio, fill_container = true) {
    const crop_process = (src, ratio, fill) => {
        return new Promise(function (resolve) {
            const image = new Image()
            image.src = src
            
            image.onload = function () {
                if (fill) {
                    if (image.width > ratio * image.height) {
                        resolve("height:100%;width:auto")
                    }
                    else {
                        resolve("width:100%;height:auto")
                    }
                }
                else {
                    if (image.width > ratio * image.height) {
                        resolve("width:100%;height:auto")
                    }
                    else {
                        resolve("height:100%;width:auto")
                    }
                }
                
            }

            // NO ERROR HANDLING!!
            // image.onerror = resolve("s")
        })
    }
    return crop_process(image_source, container_ratio, fill_container)
}