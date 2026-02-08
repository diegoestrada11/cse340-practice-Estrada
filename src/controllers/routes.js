import { Router } from 'express';

// Middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';

// Controllers
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

// Create a new router instance
const router = Router();

/**
 * ============================
 * Router-level middleware
 * ============================
 */

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">', 10);
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">', 10);
    next();
});

/**
 * ============================
 * Routes
 * ============================
 */

/**
 * Home and basic pages
 */
router.get('/', homePage);
router.get('/about', aboutPage);

/**
 * Course catalog routes
 */
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

/**
 * Faculty routes
 */
router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

/**
 * Demo page with special middleware
 */
router.get('/demo', addDemoHeaders, demoPage);

/**
 * Route to trigger a test error
 */
router.get('/test-error', testErrorPage);

export default router;
