/**
 * Include the File System module
 */
var fs = require('fs');

var path = require('path');

/**
 * Expose the functions that we need in other files
 */
module.exports = {
    uploadImages: function (files, userId) {
        // If there are files uploaded in the form
        if (files.length > 0) {
            // Check if the user has a directory and create one if not
            if (checkUserDirectory(userId)) {
                // Go through each file and upload it to the server
                files.forEach(file => {
                    // If the file is a supported image type
                    if (isSupportedFileImage(file)) {
                        // Turn it into base64 data
                        var encodedBase64 = encodeBase64(file);

                        // Get a filepath
                        var filePath = getFilePath(file, userId);

                        // Save the image on the server
                        saveImage(encodedBase64, filePath);
                    }
                })
            };
        }
    }
};

/**
 * Check if the server has a directory for the current user. If not, create a directory
 * to store the users photo
 * 
 * @param userId - User Id of the current session 
 */
function checkUserDirectory(userId) {
    var userDirectoryExists = false;
    // If the user already has a folder on the server
    if (fs.existsSync(`./test/${userId}/`)) {
        userDirectoryExists = true;
    }
    else {
        // The user folder does not exist, so create it
        fs.mkdir(`./test/${userId}/`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        userDirectoryExists = true;
    };
    return userDirectoryExists;
}

/**
 * Check if the file is of a supported file type. Currently we support .jpeg and .png
 * 
 * @param file - Image file supplied by user
 */
function isSupportedFileImage(file) {
    var isSupportedFileImage = false;

    // Get the file extention
    var fileExtention = path.extname(file);

    // Check if the file extention is of a supported type
    if (fileExtention === ".png" ||
        fileExtention === ".jpeg") {
        isSupportedFileImage = true;
    }

    return isSupportedFileImage;
}

/**
 * Returns a Base64 string representation of an image contained in the file location
 * 
 * @param file - Image file supplied by user
 * @returns A promise that will resolve with Base64 string data
 */
function encodeBase64(file) {
    // Convert binary data to base64 encoded string
    var encodedBase64 = new Buffer(file).toString("base64");

    return encodedBase64;
}

/**
 * Creates the filepath to save the user provided image too
 * 
 * @param file - Image file supplied by user
 * @param userId - User Id of the current session
 */
function getFilePath(file, userId) {
    var basePath = path.basename(file);
    var filePath = `./test/${userId}/${basePath}`;

    return filePath;
}

/**
 * Saves an image to the provided file path on the server that this is
 * running on
 * 
 * @param base64img - Base64 data of image uploaded by a user
 * @param filePath -  The path to save the image to
 */
function saveImage(base64img, filePath) {

    // Create a buffer for the data
    var buffer = new Buffer(base64img, 'base64');

    // Save the file to the server
    fs.writeFileSync(filePath, buffer);
}