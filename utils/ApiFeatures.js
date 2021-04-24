
class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(regex|gte|gt|lte|lt)\b/g, match => `$${match}`);

        let parsedFilterQueries = JSON.parse(queryStr);
        findObjectByKey(parsedFilterQueries, '$regex')

        this.query = this.query.find(parsedFilterQueries);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    getQuery() {
        return this.query;
    }

}

const findObjectByKey = (obj, key) =>{
    let result;
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (property === key) {
                let regex = new RegExp(obj[key], 'gi');
                obj[key] = regex;
            }
            else if (typeof obj[property] === "object") {
                // in case it is an object
                result = findObjectByKey(obj[property], key);
                if (typeof result !== "undefined") {
                    return result;
                }
            }
        }
    }
}


module.exports = ApiFeatures;