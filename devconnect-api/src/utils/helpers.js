module.exports = {
    generateResponse: (status, message, data = null) => {
        return {
            status,
            message,
            data
        };
    },

    handleError: (res, error) => {
        console.error(error);
        return res.status(500).json(this.generateResponse('error', 'An unexpected error occurred.'));
    },

    validateId: (id) => {
        return Number.isInteger(id) && id > 0;
    },

    paginate: (array, page, limit) => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const results = {};

        if (endIndex < array.length) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.results = array.slice(startIndex, endIndex);
        return results;
    }
};