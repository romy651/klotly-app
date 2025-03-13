let Geocoder: any
export default Geocoder = {
    apiKey: 'AIzaSyCV1oOgj7nfSHXc1di2idwPFHmW9fNETgs',

    async from(place_id: string) {
        //const url = `https://maps.google.com/maps/api/geocode/json?${toQueryParams(queryParams)}`

        const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${this.apiKey}`

        let response, data

        // fetch
        try {
            response = await fetch(url)
        } catch (error) {
            throw {
                code: Geocoder.Errors.FETCHING,
                message: 'Error while fetching. Check your network.',
                origin: error,
            }
        }

        // parse
        try {
            data = await response.json()
        } catch (error) {
            throw {
                code: Geocoder.Errors.PARSING,
                message:
                    "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
                origin: response,
            }
        }

        // check response's data
        if (data.status !== 'OK')
            throw {
                code: Geocoder.Errors.SERVER,
                message:
                    "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
                origin: data,
            }

        return data
    },

    /**
     * All possible errors.
     */
    Errors: {
        /**
         * Module hasn't been initiated. Call {@link Geocoder.init}.
         */
        NOT_INITIATED: 0,

        /**
         * Parameters are invalid.
         */
        INVALID_PARAMETERS: 1,

        /**
         * Error wile fetching to server.
         * The error.origin property contains the original fetch error.
         */
        FETCHING: 2,

        /**
         * Error while parsing server response.
         * The error.origin property contains the response.
         */
        PARSING: 3,

        /**
         * Error from the server.
         * The error.origin property contains the response's body.
         */
        SERVER: 4,
    },
}
