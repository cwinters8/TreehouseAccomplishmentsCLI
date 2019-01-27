// get required modules
const https = require('https');
const http = require('http');

/**
 * Prints the information about the user's accomplishments to the screen
 * @param {string} username 
 * @param {number} badgeCount 
 * @param {number} points 
 */
function printMessage(username, badgeCount, points) {
    const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`;
    console.log(message);
}

/**
 * Prints an error message to the screen
 * @param {error} error 
 */
function printError(error) {
    console.error(`${error.message}`);
}

/**
 * Performs a get request to the Treehouse API
 * @param {string} topic
 * @param {string} user
 * @returns request object
 */
function request(topic, user) {
    const request = https.get(`https://teamtreehouse.com/${user}.json`, response => {
        const statusCode = response.statusCode;
        if (statusCode === 200) {
            handleResponse(topic, user, response);
        } else {
            const message = `There was an error getting the profile for ${user} (${statusCode}: ${http.STATUS_CODES[statusCode]})`;
            const statusCodeError = new Error(message);
            printError(statusCodeError);
        }
    });
    return request;
}

/**
 * Handles the response data returned by the get request
 * @param {string} topic 
 * @param {string} user 
 * @param {response} response 
 */
function handleResponse(topic, user, response) {
    let body = '';
    response.on('data', data => {
        body += data.toString();
    });
    response.on('end', () => {
        parse(topic, user, body);
    });
}

/**
 * Parses data returned from the API request
 * @param {string} topic 
 * @param {string} user 
 * @param {string} body - response data
 */
function parse(topic, user, body) {
    try {
        body = JSON.parse(body);
        const badges = body.badges.length;
        const points = body.points[topic];
        printMessage(user, badges, points);
    } catch (error) {
        printError(error);
    }
}

/**
 * Primary function to return the data from the API
 * @param {string} topic 
 * @param {string} user 
 */
function get(topic, user) {
    try {
        const req = request(topic, user);
        // error handling
        req.on('error', printError);
    } catch (error) {
        printError(error);
    }
}

// export the function
module.exports.get = get;