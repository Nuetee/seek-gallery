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