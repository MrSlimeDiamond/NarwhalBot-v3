const config = require("../config.json")
const apiURL = config.api.apiURL


/**
 * Get an API endpoint
 * @param {string} endpoint 
 * @returns json result
 */
async function getEndpoint(endpoint) {
    const request = await fetch(config.api.apiURL + endpoint)
    const result = await request.json()

    return result
}

module.exports = getEndpoint