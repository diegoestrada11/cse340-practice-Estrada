// Imports
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Declare Important Variables
 */
const PORT = process.env.PORT || 3000;
const name = process.env.NAME;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Declare Routes
 */

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
