/**
 * Controllers for basic static pages.
 * 
 * These functions act as route handlers and are responsible for:
 * - Responding to requests
 * - Rendering the appropriate EJS templates
 * - Passing page-specific data to the views
 * 
 * This file contains only controller logic and does not handle routing,
 * middleware configuration, or data access.
 */

/**
 * Controller for the home page.
 * Renders the home view.
 */
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
};

/**
 * Controller for the about page.
 * Renders the about view.
 */
const aboutPage = (req, res) => {
    res.render('about', { title: 'About' });
};

/**
 * Controller for the demo page.
 * Used to demonstrate route-specific middleware behavior.
 */
const demoPage = (req, res) => {
    res.render('demo', { title: 'Middleware Demo Page' });
};

/**
 * Controller used to intentionally trigger a server error.
 * This route forwards an error to the global error handler
 * to demonstrate 500-level error handling.
 */
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { homePage, aboutPage, demoPage, testErrorPage };
