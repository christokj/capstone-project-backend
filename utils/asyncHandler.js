import fs from 'fs';
import path from 'path';

// Function to create custom error objects
const createError = (status, message, code) => ({
    status: status || 500,
    message: message || "Internal Server Error",
    code: code || 'UNDEFINED_ERROR',
    stack: new Error().stack,
});

// Function to log errors asynchronously to a file
const logErrorToFile = async (err) => {
    const logPath = path.join('error.log');
    const logMessage = `[${new Date().toISOString()}] - ${err.status} - ${err.message} - ${err.stack}\n`;
    return new Promise((resolve, reject) => {
        fs.appendFile(logPath, logMessage, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

// Function to send detailed error responses
const sendErrorResponse = async (err, res) => {
    if (process.env.NODE_ENV === 'development') {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            code: err.code
        });
    } else {
        // Production - Hide stack traces
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            code: err.code
        });
    }
};

// Highly Complicated Async Handler
const asyncHandler = (fn) => async (req, res, next) => {
    console.log(`[${new Date().toISOString()}] - Request to ${req.method} ${req.originalUrl} started`);

    try {
        // Optional: Simulate latency or delay in the async function for monitoring
        // await new Promise(resolve => setTimeout(resolve, 100));

        // Execute the provided async function
        await fn(req, res, next);

        console.log(`[${new Date().toISOString()}] - Request to ${req.method} ${req.originalUrl} completed successfully`);
        next();
    } catch (err) {
        console.error(`[${new Date().toISOString()}] - Error in request to ${req.method} ${req.originalUrl}:`, err);

        // If the error does not have the expected properties, create a new one
        if (!err.status || !err.message || !err.code) {
            err = createError(err.status, err.message, err.code);
        }

        // Log the error to a file
        try {
            await logErrorToFile(err);
        } catch (fileError) {
            console.error(`[${new Date().toISOString()}] - Failed to write error to log file:`, fileError);
        }

        // Send detailed error response to the client
        await sendErrorResponse(err, res);

        // Pass the error to the next middleware
        next(err);
    }
};

export default asyncHandler;
