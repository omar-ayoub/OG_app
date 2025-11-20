// Error handling middleware
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // PostgreSQL specific errors
    if (err.code) {
        switch (err.code) {
            case '23505': // unique_violation
                return res.status(409).json({
                    error: 'Duplicate entry',
                    message: err.detail || 'A record with this value already exists'
                });
            case '23503': // foreign_key_violation
                return res.status(400).json({
                    error: 'Invalid reference',
                    message: 'Referenced record does not exist'
                });
            case '23502': // not_null_violation
                return res.status(400).json({
                    error: 'Missing required field',
                    message: err.column ? `Field '${err.column}' is required` : 'Required field is missing'
                });
            default:
                break;
        }
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

// 404 handler
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
}

// Async wrapper to catch errors in async route handlers
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
