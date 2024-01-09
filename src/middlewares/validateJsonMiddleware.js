function validateJsonMiddleware(req, res, next) {
    const contentType = req.get('Content-Type');
  
    if (contentType && contentType.toLowerCase() === 'application/json') {
        next();
    } else {
        return res.status(400).json({ message: "'Content-Type' header should be 'application/json'" });
    }
}

module.exports = validateJsonMiddleware;