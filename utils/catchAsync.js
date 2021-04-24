module.exports = callback => {
    return (req, resp, next) => {
        callback(req,resp, next).catch(next);
    }
}